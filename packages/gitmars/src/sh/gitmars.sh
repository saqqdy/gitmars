# Created by Gitmars v1.4.1 (https://github.com/saqqdy/gitmars#readme)
#   At: 10/11/2020, 4:04:28 PM
#   From: /Users/saqqdy/www/saqqdy/gitmars (https://github.com/saqqdy/gitmars#readme)

debug() {
  if [ "$GITMARS_DEBUG" = "true" ] || [ "$GITMARS_DEBUG" = "1" ]; then
    echo "gitmars:debug $1"
  fi
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

run_command() {
  if command_exists "$1"; then
    # "$@" gitm $hookName "$gitParams"
    gitm run $hookName "$gitParams"

    exitCode="$?"
    debug "$* gitm exited with $exitCode exit code"

    if [ $exitCode -eq 127 ]; then
      echo "Can't find Gitmars, skipping $hookName hook"
      echo "You can reinstall it using 'npm install gitmars --save-dev' or delete this hook"
    else
      exit $exitCode
    fi

  else
    echo "Can't find $1 in PATH: $PATH"
    echo "Skipping $hookName hook"
    exit 0
  fi
}

hookIsDefined() {
  dir=$(git rev-parse --show-cdup)
  grep -qs $hookName \
    package.json \
    .gitmarsrc \
    .gitmarsrc.json \
    .gitmarsrc.yaml \
    .gitmarsrc.yml \
    $dir"package.json" \
    $dir".gitmarsrc" \
    $dir".gitmarsrc.json" \
    $dir".gitmarsrc.yaml " \
    $dir".gitmarsrc.yml"
}

gitmarsVersion="0.0.0"
gitParams="$*"
hookName="$(basename "$0")"

debug "gitmars v$gitmarsVersion - $hookName"

# Skip if GITMARS_SKIP_HOOKS is set
if [ "$GITMARS_SKIP_HOOKS" = "true" ] || [ "$GITMARS_SKIP_HOOKS" = "1" ]; then
  debug "GITMARS_SKIP_HOOKS is set to $GITMARS_SKIP_HOOKS, skipping hook"
  exit 0
fi

# Source user var and change directory
. "$(dirname "$0")/gitmars.local.sh"
debug "Current working directory is $(pwd)"

# Skip fast if hookName is not defined
# Don't skip if .gitmarsrc.js or .gitmarsrc.config.js are used as the heuristic could
# fail due to the dynamic aspect of JS. For example:
# `"pre-" + "commit"` or `require('./config/hooks')`)
if [ ! -f .gitmarsrc.js ] && [ ! -f gitmars.config.js ] && ! hookIsDefined; then
  debug "$hookName config not found, skipping hook"
  exit 0
fi

# Source user ~/.gitmarsrc
if [ -f ~/.gitmarsrc ]; then
  debug "source ~/.gitmarsrc"
  . ~/.gitmarsrc
fi

# Set GITMARS_GIT_STDIN from stdin
case $hookName in
"pre-push" | "post-rewrite")
  export GITMARS_GIT_STDIN="$(cat)"
  ;;
esac

# Windows 10, Git Bash and Yarn 1 installer
if command_exists winpty && test -t 1; then
  exec </dev/tty
fi

# Run gitm hook with the package manager used to install Gitmars
case $packageManager in
"npm") run_command npx --no-install ;;
"npminstall") run_command npx --no-install ;;
"pnpm") run_command pnpx --no-install ;;
"yarn") run_command yarn run --silent ;;
*)
  echo "Unknown package manager: $packageManager"
  exit 0
  ;;
esac
