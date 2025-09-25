# Turbo GoReleaser Issues & Improvement Plan

## Testing Summary

After implementing the turbo-goreleaser workflow in the test repository, we identified several critical issues that need to be addressed in the main turbo-goreleaser project.

## Critical Issues Found

### 1. **Action Build Issue - BLOCKING** 🚨
- **Problem**: `Error: Cannot find module '/home/runner/work/_actions/jameswlane/turbo-goreleaser/v1.0.0/dist/index.js'`
- **Root Cause**: The v1.0.0 release doesn't include the built `dist/index.js` file
- **Impact**: Complete action failure - workflow cannot execute
- **Priority**: CRITICAL - Must fix immediately

### 2. **Go Version Issue** ⚠️
- **Problem**: Go version 1.25.1 doesn't exist (Go is currently at ~1.23.x)
- **Current Behavior**: Mise installs "latest" but logs show 1.25.1
- **Impact**: Potential build failures, confusion
- **Note**: This might be a mise issue or misconfiguration

### 3. **Workflow Integration Issues** ⚠️
- **Problem**: Multiple redundant tool setups between mise and GitHub Actions
- **Impact**: Version conflicts (pnpm), slower execution
- **Status**: Partially resolved in test, but action should handle this better

## Successful Elements

✅ **Proper GoReleaser Config Detection**: Action correctly identifies and uses `.goreleaser.yaml` files
✅ **Monorepo Tag Prefix Logic**: Slash-style tags work as expected
✅ **GoReleaser Pro Integration**: Proper license key handling and Pro version installation
✅ **Environment Setup**: Mise integration works for tool management

## Action Plan for turbo-goreleaser Project

### Phase 1: Critical Fixes (Immediate)

#### 1.1 Fix Action Build Process
- **Task**: Ensure `dist/index.js` is included in releases
- **Steps**:
  - Add build step to release workflow
  - Run `npm run build` or equivalent before creating release
  - Verify `dist/` directory is committed or generated during release
  - Test release process in development

#### 1.2 Fix Version Tag Strategy
- **Task**: Create proper v1 tag for easier consumption
- **Steps**:
  - After fixing build, create/move `v1` tag to latest stable version
  - Update documentation to reference `@v1` instead of `@v1.0.0`
  - Consider using `v1.x` pattern for semantic versioning

#### 1.3 Go Version Validation
- **Task**: Fix Go version handling
- **Steps**:
  - Research why 1.25.1 is being reported
  - Add validation for supported Go versions
  - Update documentation with tested Go versions
  - Consider pinning Go version in action for consistency

### Phase 2: Workflow Improvements (High Priority)

#### 2.1 Smart Tool Management
- **Task**: Avoid tool setup conflicts
- **Steps**:
  - Detect if mise.toml exists and skip redundant tool setup
  - Add option to disable internal tool setup when mise is used
  - Provide clear documentation on tool management strategies

#### 2.2 Enhanced Error Reporting
- **Task**: Improve debugging experience
- **Steps**:
  - Add detailed logging for package detection
  - Show which .goreleaser.yaml files are found and used
  - Add debug mode with verbose output
  - Clear error messages when no packages are detected

#### 2.3 Dependency Handling
- **Task**: Better handle package.json vs Go-only packages
- **Steps**:
  - Don't require package.json for Go-only monorepos
  - Add Turbo.json configuration validation
  - Support mixed-language monorepos better

### Phase 3: Feature Enhancements (Medium Priority)

#### 3.1 Pre-flight Validation
- **Task**: Add comprehensive validation before release
- **Steps**:
  - Validate all .goreleaser.yaml files syntax
  - Check for conflicting tag prefixes
  - Verify Go module compatibility
  - Test GoReleaser dry-run on all packages

#### 3.2 Better Change Detection
- **Task**: Improve Turbo integration
- **Steps**:
  - Add option to use `turbo run build --dry=json` for change detection
  - Support custom Turbo filters
  - Handle Git-based change detection fallback

#### 3.3 Advanced Configuration Options
- **Task**: More flexible configuration
- **Steps**:
  - Support custom GoReleaser config templates
  - Add option to specify which packages to include/exclude
  - Support different tag formats per package type

### Phase 4: Testing & Documentation (Ongoing)

#### 4.1 Comprehensive Test Suite
- **Task**: Automated testing for different scenarios
- **Steps**:
  - Go-only monorepos (current test case)
  - Mixed JS/Go monorepos
  - Different tag format preferences
  - Various Turbo configurations

#### 4.2 Documentation Improvements
- **Task**: Better user guidance
- **Steps**:
  - Add troubleshooting section
  - Go-specific examples and best practices
  - Integration guides for different CI environments
  - Migration guide from other release tools

## Immediate Next Steps

1. **Fix the build process** - This is blocking all testing
2. **Create proper v1 tag** - Makes action easier to consume
3. **Test with corrected version** - Validate other functionality works
4. **Document known limitations** - Help users avoid common issues

## Test Repository Value

This test repository should be maintained as:
- **Integration test environment** for new versions
- **Example implementation** for documentation
- **Regression testing** for future changes
- **Performance benchmarking** baseline

## Implementation Priority

```
CRITICAL (Week 1):  Fix build, create v1 tag, validate basic functionality
HIGH (Week 2):      Tool management conflicts, error reporting
MEDIUM (Week 3-4):  Enhanced features, validation, change detection
ONGOING:           Testing, documentation, community feedback
```

This plan provides a clear roadmap to transform turbo-goreleaser from its current broken state into a robust, production-ready monorepo release tool.