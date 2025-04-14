# Contributing to the Wait-For Orb

We welcome contributions to this orb! Whether it's improving documentation, adding new features, or fixing bugs, your help is appreciated.

## How to Contribute

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test your changes locally using the CircleCI CLI
5. Push your branch and open a Pull Request

## Development Environment Setup

1. Install the CircleCI CLI: 
   ```bash
   curl -fLSs https://raw.githubusercontent.com/CircleCI-Public/circleci-cli/master/install.sh | bash
   ```

2. Validate your orb:
   ```bash
   circleci orb validate orb.yml
   ```

3. Pack your orb:
   ```bash
   circleci orb pack src > orb.yml
   ```

## Testing

Before submitting a pull request, please test your changes:

1. Pack the orb:
   ```bash
   circleci orb pack src > orb.yml
   ```

2. Validate the orb:
   ```bash
   circleci orb validate orb.yml
   ```

3. If you have access to publish dev versions, you can test a dev version:
   ```bash
   circleci orb publish orb.yml nobari/wait-for@dev:your-feature
   ```

## Orb Publishing

Orbs are published according to semantic versioning principles:

- Major changes (breaking): X.0.0
- Minor changes (new features, non-breaking): 0.X.0
- Patch changes (bug fixes, non-breaking): 0.0.X

Changes will be automatically published by CircleCI when pull requests are merged to the main branch with appropriate git tags.

## Code Style

- Use consistent indentation (2 spaces)
- Follow good shell scripting practices
- Comment your code, especially complex sections
- Use descriptive parameter names

## Questions?

If you have any questions about contributing, please open an issue or reach out to the maintainers.

Thank you for contributing to the Wait-For Orb! 