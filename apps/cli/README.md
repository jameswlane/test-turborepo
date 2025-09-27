# CLI Application

A command-line interface (CLI) application built with Go and integrated into a Turborepo monorepo.

## Overview

This CLI application is part of a larger monorepo structure and provides command-line functionality for the project ecosystem.

## Prerequisites

- Go 1.25 or higher
- Node.js (for monorepo integration)

## Installation

### From Source

1. Navigate to the CLI directory:
   ```bash
   cd apps/cli
   ```

2. Build the application:
   ```bash
   go build -o bin/cli .
   ```

3. Run the CLI:
   ```bash
   ./bin/cli
   ```

### Using Go Install
```
bash
go install ./apps/cli
```
## Usage

Run the CLI with:
```
bash
./bin/cli [command] [flags]
```
### Available Commands

- `serve` - Start the server
- `help` - Display help information

Use `--help` with any command to see available options and flags.

## Development

### Building
```
bash
go build -o bin/cli .
```
### Running Tests
```
bash
go test ./...
```
### Development with Turbo

From the project root, you can use Turbo commands to build and test:
```
bash
# Build the CLI
turbo build --filter=cli

# Run tests
turbo test --filter=cli
```
## Project Structure
```

apps/cli/
├── cmd/           # Command definitions
│   ├── root.go    # Root command
│   └── serve.go   # Serve command
├── bin/           # Built binaries
├── main.go        # Application entry point
├── go.mod         # Go module definition
├── package.json   # Node.js package config (for Turbo)
└── README.md      # This file
```
## Release

This project uses GoReleaser for automated releases. The configuration is defined in `.goreleaser.yaml`.

## License

See the [LICENSE](LICENSE) file for license information.

## Contributing

This CLI is part of a larger monorepo. Please refer to the root README for contribution guidelines.