## Changelog Entry

### Version 1.1.2

#### ✨ New Features

**Added support for including restricted utility modifiers in UI generation**

- **New Configuration Option**: Added `includeRestrictedModifiers` option to the parser constructor
- **Enhanced Utility Processing**: When enabled, utility modifiers with `@restrict` annotations are now included in the generated `ui.json` output
- **Improved Selector Matching**: Enhanced logic to handle complex selectors (e.g., `[class*='slds-box']`) and find their associated restricted modifiers

#### 🔧 Technical Changes

**Parser Constructor**
- Modified `createParser()` function to accept an optional `options` parameter
- Options are now passed through to both `createRepository()` and `createComment()` functions

**Repository Enhancements**
- Exposed `options` and `comments` properties in the repository return object
- Enhanced `findAllByRestrict()` function to work with the new modifier inclusion logic

**Utility Function Updates**
- Modified the `utility()` function to conditionally include restricted modifiers based on the `includeRestrictedModifiers` option
- Added logic to extract base class names from complex attribute selectors (e.g., extracting `slds-box` from `[class*='slds-box']`)
- Implemented fallback logic to find modifiers restricted to the utility's base class

#### Usage Example

```javascript
// Before: Only utility base classes were included
const parser = createParser(scss);
const boxUtility = parser.utility('box');
// boxUtility.restrictees only contained [class*='slds-box']

// After: Restricted modifiers are included when option is enabled
const parser = createParser(scss, { includeRestrictedModifiers: true });
const boxUtility = parser.utility('box');
// boxUtility.restrictees now includes:
// - [class*='slds-box'] (base utility)
// - .slds-box_xx-small (restricted modifier)
// - .slds-box_x-small (restricted modifier)
// - .slds-box_small (restricted modifier)
// - .slds-box_link (restricted modifier)
```

#### 🔍 What This Enables

This change allows design system tools to properly represent utility modifiers that have `@restrict` annotations, ensuring that utilities like `.slds-box` can include their associated modifiers (`.slds-box_xx-small`, `.slds-box_x-small`, etc.) in the generated UI documentation and component libraries.

#### ⚠️ Breaking Changes

- **None**: This is a backward-compatible enhancement that adds new functionality without changing existing behavior

#### 🧪 Testing

- Added comprehensive test coverage for the new `includeRestrictedModifiers` functionality
- Verified that existing parser behavior remains unchanged when the option is not specified
- Confirmed that the new option correctly processes utility modifiers with `@restrict` annotations