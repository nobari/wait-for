# Wait-For CircleCI Orb

[![CircleCI Build Status](https://circleci.com/gh/nobari/wait-for.svg?style=shield "CircleCI Build Status")](https://circleci.com/gh/nobari/wait-for) [![CircleCI Orb Version](https://badges.circleci.com/orbs/nobari/wait-for.svg)](https://circleci.com/orbs/registry/orb/nobari/wait-for) [![GitHub License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://raw.githubusercontent.com/nobari/wait-for/master/LICENSE)

A CircleCI orb that provides robust commands for waiting on HTTP endpoints to become available before proceeding with subsequent steps in your workflows.

## Usage

Example use-case:

```yaml
version: 2.1

orbs:
  wait-for: nobari/wait-for@1.0.0

jobs:
  integration-test:
    docker:
      - image: cimg/base:current
    steps:
      - checkout
      - run:
          name: Start service
          command: ./start-service.sh
          background: true
      - wait-for/wait_for_endpoint:
          url: "http://localhost:8080/health"
          service_name: "Backend API"
          timeout: 180
      - run:
          name: Run tests
          command: ./run-tests.sh

workflows:
  test-workflow:
    jobs:
      - integration-test
```

## Commands

### wait_for_endpoint

Wait for an HTTP endpoint to become available.

| Parameter    | Type      | Default | Description                                                    |
|--------------|-----------|---------|----------------------------------------------------------------|
| url          | string    | -       | The URL to poll (required)                                     |
| service_name | string    | -       | A descriptive name for the service (required)                  |
| timeout      | integer   | 120     | Maximum time to wait in seconds before failing                 |
| interval     | integer   | 5       | Interval between checks in seconds                             |
| verbose      | boolean   | true    | Enable verbose output                                         |
| status_code  | integer   | 200     | Expected HTTP status code to consider endpoint available       |
| headers      | string    | ""      | Optional HTTP headers (format: 'Header-Name: value')           |
| method       | enum      | GET     | HTTP method to use (GET, POST, HEAD)                           |
| fail_on_error| boolean   | true    | Whether to fail the build if the endpoint is not available     |

## Examples

### Basic Usage

```yaml
version: 2.1

orbs:
  wait-for: nobari/wait-for@1.0.0

jobs:
  test:
    docker:
      - image: cimg/base:current
    steps:
      - wait-for/wait_for_endpoint:
          url: "http://api.example.com/health"
          service_name: "Example API"
```

### Advanced Usage with Custom Headers

```yaml
version: 2.1

orbs:
  wait-for: nobari/wait-for@1.0.0

jobs:
  test:
    docker:
      - image: cimg/base:current
    steps:
      - wait-for/wait_for_endpoint:
          url: "http://api.example.com/health"
          service_name: "Authenticated API"
          timeout: 300
          interval: 10
          headers: "Authorization: Bearer ${API_TOKEN}\nContent-Type: application/json"
          method: POST
          status_code: 201
          verbose: false
```

## Contributing

We welcome [issues](https://github.com/nobari/wait-for/issues) and [pull requests](https://github.com/nobari/wait-for/pulls) against this repository!

For significant changes, please open an issue first to discuss what you would like to change.

## License

[MIT License](LICENSE) 