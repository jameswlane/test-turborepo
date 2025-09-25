# Turbo GoReleaser Test Plan

## Repository Setup
- **Type**: TurboRepo monorepo with Go packages
- **Structure**:
  - Apps: `apps/cli` (Go CLI application)
  - Packages:
    - `packages/desktop-test` (Go)
    - `packages/package-manager-test` (Go)
    - `packages/system-test` (Go)
    - `packages/test-sdk` (Go)
    - `packages/tool-test` (Go)
- **GoReleaser Configs**: Each package/app has its own `.goreleaser.yaml` with proper monorepo configuration

## Workflow Configuration
- **File**: `.github/workflows/release.yml`
- **Trigger**: Push to main branch or manual workflow dispatch
- **Tag Format**: slash style (`package-name/v1.0.0`)
- **Release Type**: all (apps and packages)
- **Conventional Commits**: enabled

## Test Scenarios

### 1. Initial Release Test
- [ ] Push initial commit to trigger workflow
- [ ] Verify GoReleaser detects all Go packages
- [ ] Check if tags are created in correct format
- [ ] Validate release artifacts generation

### 2. Change Detection Test
- [ ] Modify only one package
- [ ] Push changes with conventional commit
- [ ] Verify only changed package gets new release
- [ ] Check dependency graph handling

### 3. Dry Run Test
- [ ] Trigger workflow with dry-run=true
- [ ] Verify no actual releases are created
- [ ] Check generated GoReleaser configs

## Potential Issues to Monitor

### 1. Go Module Names
- **Issue**: Go modules use simple names (e.g., `cli`) instead of full paths
- **Impact**: May affect GoReleaser binary naming
- **Solution**: May need custom `.goreleaser.yml` files

### 2. Missing package.json Files
- **Issue**: Go packages don't have package.json files
- **Impact**: Turbo change detection might not work correctly
- **Solution**: Ensure turbo.json properly handles Go-only packages

### 3. Go Version
- **Issue**: go.mod specifies Go 1.25.1 (invalid version)
- **Impact**: Build failures
- **Solution**: Fix Go version in all go.mod files

### 4. No Tests Defined
- **Issue**: No test scripts in turbo.json or package.json
- **Impact**: Test step will be skipped
- **Solution**: Add Go test commands to turbo.json

## Action Items for turbo-goreleaser Project

If issues are found during testing:

1. **Change Detection Enhancement**:
   - Add better support for Go-only monorepos
   - Handle packages without package.json files
   - Use go.mod for version detection

2. **GoReleaser Config Generation**:
   - Improve module name detection from go.mod
   - Add option to customize binary names
   - Better handling of workspace-style Go modules

3. **Documentation Updates**:
   - Add Go-specific examples
   - Document required turbo.json configuration for Go projects
   - Clarify package.json requirements

## Test Commands

```bash
# Manual local test (dry run)
gh workflow run release.yml -f dry-run=true

# Check workflow syntax
gh workflow list

# View workflow runs
gh run list --workflow=release.yml

# Debug specific run
gh run view [RUN_ID] --log
```

## Next Steps

1. Commit and push this test setup
2. Monitor workflow execution
3. Document any errors or unexpected behavior
4. Create detailed bug report for turbo-goreleaser project
5. Suggest improvements based on test results