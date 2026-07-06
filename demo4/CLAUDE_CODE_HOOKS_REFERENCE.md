# Claude Code Hooks — Authoritative Technical Reference

**Version:** 2026-07 (validated against user configurations and official patterns)  
**Status:** Complete technical reference for course material

---

## 1. HOOK EVENTS — Complete List

| Event | Fires When | Blocking? | Can Modify? | Use Cases |
|-------|-----------|-----------|------------|-----------|
| **PreToolUse** | Before ANY tool executes | ✓ Yes (exit 2) | Limited | Validation, security guards, command blocking |
| **PostToolUse** | After tool completes successfully | ✗ No (exit 2 = error only) | ✓ Output formatting | Logging, auto-formatting, follow-up actions |
| **Notification** | Claude needs user input (idle 60s+, permission, MCP elicit) | ✗ No | ✓ Message override | Desktop alerts, Slack notifications, sound effects |
| **SessionStart** | Session begins (user starts Claude Code) | ✗ No | ✓ Env injection | Context injection, setup, initialization |
| **SessionEnd** | Session terminates normally | ✗ No | No | Cleanup, metrics export, archival |
| **Stop** | Agent finishes a turn (user says "stop") | ✓ Yes (exit 2) | No | Turn completion logic, blocking exit, state machine |
| **SubagentStop** | Subagent finishes its turn | ✗ No | No | Subagent completion notifications |
| **PreCompact** | (Implied, not fully documented) | ? | ? | Context compaction preparation |

**Key constraint:** Only PreToolUse and Stop can block via exit code 2.

---

## 2. CONFIGURATION SCHEMA

### File Locations
- User: ~/.claude/settings.json
- Project: ./.claude/settings.json  
- Local: ./.claude/settings.local.json

### JSON Structure

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "TOOL_NAME_OR_PATTERN_OR_*",
        "hooks": [
          {
            "type": "command",
            "command": "script_path",
            "timeout": 5000
          }
        ]
      }
    ]
  }
}
```

### Matchers by Event
- PreToolUse: ✓ (by tool name)
- PostToolUse: ✓ (by tool name)
- Notification: ✓ (permission_prompt, idle_prompt, auth_success, elicitation_dialog)
- SessionStart: ✗ (no matcher)
- SessionEnd: ✗ (no matcher)
- Stop: ✗ (no matcher)
- SubagentStop: ✗ (no matcher)

---

## 3. HOOK INPUT — JSON on stdin

Fields present depend on event type:

**Always present:** session_id, transcript_path, cwd, hook_event_name

**PreToolUse:** tool_name, tool_input (tool_response NOT present yet)
**PostToolUse:** tool_name, tool_input, tool_response
**Notification:** notification_type, notification_message
**SessionStart:** (no tool data)
**Stop/SubagentStop:** (plus subagent_id for SubagentStop)

---

## 4. HOOK OUTPUT

### Exit Codes
- **Exit 0:** Success, proceed normally
- **Exit 2:** Block (only PreToolUse/Stop); stderr fed to Claude
- **Exit 1,3+:** Non-blocking error, fail-open

### JSON stdout (preferred)
```json
{
  "decision": "approve|block",
  "reason": "string",
  "suppressOutput": false,
  "continue": true,
  "hookSpecificOutput": {
    "permissionDecision": "allow|deny|ask"
  }
}
```

---

## 5. SECURITY — Critical Notes

1. Hooks run with full user permissions
2. Never interpolate tool_input directly into shell
3. Always validate file paths (no traversal)
4. Protect: .env, credentials, .ssh, .git, private keys
5. Fail-open required (ERR traps, try/except)

---

## 6. PRACTICAL EXAMPLES (6 patterns)

### 1. PreToolUse Guard — Block Dangerous Bash
File: `.claude/hooks/security-guard.sh`

```bash
#!/usr/bin/env bash
set +e
trap 'printf "{\"decision\":\"approve\"}\n"; exit 0' ERR

INPUT=$(cat 2>/dev/null || echo '{}')
TOOL_NAME=$(printf '%s' "$INPUT" | python3 -c "import sys, json; print(json.load(sys.stdin).get('tool_name', ''))" 2>/dev/null)
COMMAND=$(printf '%s' "$INPUT" | python3 -c "import sys, json; print(json.load(sys.stdin).get('tool_input', {}).get('command', ''))" 2>/dev/null)

[ "$TOOL_NAME" != "Bash" ] && printf '{"decision":"approve"}\n' && exit 0

echo "$COMMAND" | grep -qE "rm -rf /|chmod 777|curl.*\|.*sh|DROP DATABASE" && \
  printf '{"decision":"block","reason":"Dangerous pattern detected"}\n' && exit 0

printf '{"decision":"approve"}\n'
exit 0
```

Settings:
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{"type": "command", "command": "bash .claude/hooks/security-guard.sh"}]
    }]
  }
}
```

### 2. PostToolUse Formatter — Auto-Prettier
File: `.claude/hooks/auto-format.sh`

```bash
#!/usr/bin/env bash
set +e
trap 'exit 0' ERR

INPUT=$(cat 2>/dev/null || echo '{}')
TOOL_NAME=$(printf '%s' "$INPUT" | python3 -c "import sys, json; print(json.load(sys.stdin).get('tool_name', ''))" 2>/dev/null)
FILE_PATH=$(printf '%s' "$INPUT" | python3 -c "import sys, json; print(json.load(sys.stdin).get('tool_input', {}).get('file_path', ''))" 2>/dev/null)

[[ "$TOOL_NAME" =~ ^(Edit|Write)$ ]] && [[ "$FILE_PATH" =~ \.(js|ts|jsx|tsx)$ ]] && \
  command -v prettier &>/dev/null && prettier --write "$FILE_PATH" 2>/dev/null

exit 0
```

Settings:
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "(Edit|Write)",
      "hooks": [{"type": "command", "command": "bash .claude/hooks/auto-format.sh"}]
    }]
  }
}
```

### 3. Notification — Desktop Alert on Permission
File: `.claude/hooks/notify-permission.sh`

```bash
#!/usr/bin/env bash
set +e

INPUT=$(cat 2>/dev/null || echo '{}')
NOTIF_TYPE=$(printf '%s' "$INPUT" | python3 -c "import sys, json; print(json.load(sys.stdin).get('notification_type', ''))" 2>/dev/null)

[ "$NOTIF_TYPE" = "permission_prompt" ] && {
  command -v notify-send &>/dev/null && notify-send "Claude Code" "Permission needed" --urgency=critical
  printf '\a'
}

exit 0
```

Settings:
```json
{
  "hooks": {
    "Notification": [{
      "matcher": "permission_prompt",
      "hooks": [{"type": "command", "command": "bash .claude/hooks/notify-permission.sh"}]
    }]
  }
}
```

### 4. Stop Hook — State Machine (Plan Review)
File: `.claude/hooks/plan-review-stop.sh`

```bash
#!/usr/bin/env bash
set +e
trap 'printf "{\"decision\":\"approve\"}\n"; exit 0' ERR

[ ! -f "PLAN.md" ] || [ ! -s "PLAN.md" ] && \
  printf '{"decision":"block","reason":"Draft PLAN.md before ending turn"}\n' && exit 0

printf '{"decision":"approve"}\n'
exit 0
```

Settings:
```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{"type": "command", "command": "bash .claude/hooks/plan-review-stop.sh"}]
    }]
  }
}
```

### 5. SessionStart — Inject Context
File: `.claude/hooks/session-init.sh`

```bash
#!/usr/bin/env bash
set +e

mkdir -p .claude/logs .claude/hooks

[ ! -f ".claude/CLAUDE.md" ] && cat > .claude/CLAUDE.md << 'EOF'
# Project Setup
## Commands
- make test
- make dev
- make lint
EOF

export PROJECT_ENV="development"
printf '[%s] Session started\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> .claude/logs/sessions.log

exit 0
```

Settings:
```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{"type": "command", "command": "bash .claude/hooks/session-init.sh", "statusMessage": "Initializing..."}]
    }]
  }
}
```

### 6. PostToolUse Logger — Structured Activity Log
File: `.claude/hooks/activity-logger.py`

```python
#!/usr/bin/env python3
import json, sys, os
from datetime import datetime

try:
    data = json.load(sys.stdin)
    if data.get("hook_event_name") != "PostToolUse":
        sys.exit(0)
    
    log_entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "session_id": data.get("session_id"),
        "tool": data.get("tool_name"),
        "success": "error" not in str(data.get("tool_response", {})).lower()
    }
    
    log_path = ".claude/logs/activity.jsonl"
    os.makedirs(os.path.dirname(log_path), exist_ok=True)
    with open(log_path, "a") as f:
        f.write(json.dumps(log_entry) + "\n")
except:
    pass
sys.exit(0)
```

Settings:
```json
{
  "hooks": {
    "PostToolUse": [{
      "hooks": [{"type": "command", "command": "python3 .claude/hooks/activity-logger.py"}]
    }]
  }
}
```

---

## 7. TESTING HOOKS

### Manual Test
```bash
cat > /tmp/hook-input.json << 'EOF'
{
  "session_id": "test",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {"command": "ls"},
  "cwd": "/path/to/project",
  "transcript_path": "/path/to/transcript.txt"
}
EOF

cat /tmp/hook-input.json | bash .claude/hooks/security-guard.sh
```

### Debug
```bash
bash -x .claude/hooks/my-hook.sh < /tmp/hook-input.json
echo "Exit: $?"
```

---

## 8. GOTCHAS

1. Tool names case-sensitive: Bash, Edit, Read, Write
2. Exit 2 blocks only PreToolUse/Stop
3. PostToolUse exit 2 doesn't block (tool already ran)
4. Timeout default 5000ms
5. Hooks cannot be interactive
6. SubagentStop may be incomplete

---

## 9. REFERENCES

- Official: https://code.claude.com/docs/en/claude-code/hooks
- Guide: https://docs.claude.com/en/docs/claude-code/hooks-guide

Compiled: 2026-07 from official patterns, real implementations, and validated against Claude Code.

---

END OF REFERENCE

