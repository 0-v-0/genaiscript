# action-poem action

A custom GitHub Action that runs the script `action-poem`.

This is the description

## Inputs

- `github_token`: GitHub token with `models: read` permission at least. (required)
## Outputs


## Usage

```yaml
uses: action-poem-action
with:
  github_token: ${{ ... }}
```

## Example

```yaml
name: Run action-poem Action
on:
    workflow_dispatch:
    push:
permissions:
    contents: read
    models: read
concurrency:
    group: action-poem-${{ github.workflow }}-${{ github.ref }}
    cancel-in-progress: true
jobs:
  run-script:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Run action-poem Action
        uses: action-poem-action@main
        with:
          github_token: ${{ inputs.github_token || "" }}
```