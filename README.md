# SKALE Network Documentation

This repository contains all documentation files and pointers that serve https://skale.network/docs. It contains a combination of Markdown (md/mdx), AsciiDocs (adoc), and naviagion schema (json).

To make changes, 
1. First open an Issue to discuss your proposed changes.
2. Open a PR containing the suggested changes.

Please try to conform Markdown files to markdownlint.

## Solidity Inline Docs
For docs generated from Solidity inline Natspec, OpenZepplin's [solidity-docgen](https://github.com/OpenZeppelin/solidity-docgen) is used. Suggested formatting is:

```
/* @dev [Descripton of function]
 * [Line two of description]
 *
 * Emits a {EVENT_NAME} event.
 *
 * Requirements:
 * - First requirement description.
 * - Second requirement description.
 */
 function ...
 ```

## Styles
Suggest to use a style linter such as [Vale](https://github.com/errata-ai/vale). Currently, the docs follow the [Microsoft Writing Style Guide](https://docs.microsoft.com/en-us/style-guide/welcome/).
