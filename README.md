# Wait-For CircleCI Orb

[![CircleCI Build Status](https://circleci.com/gh/nobari/wait-for.svg?style=shield "CircleCI Build Status")](https://circleci.com/gh/nobari/wait-for) [![CircleCI Orb Version](https://badges.circleci.com/orbs/nobari/wait-for.svg)](https://circleci.com/orbs/registry/orb/nobari/wait-for) [![GitHub License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://raw.githubusercontent.com/nobari/wait-for/master/LICENSE)

A robust CircleCI orb that provides advanced commands for waiting on HTTP endpoints to become available before proceeding with subsequent steps in your workflows. Perfect for microservice architectures, integration testing, and ensuring dependencies are ready before testing against them.

## Overview

In modern CI/CD pipelines, particularly with microservices and distributed systems, services often need to wait for other services to be ready before proceeding. The `wait-for` orb provides a flexible, configurable solution to this common problem.

Key features:
- Poll HTTP endpoints with configurable intervals and timeouts
- Support for authentication, custom headers, and request bodies
- Advanced response validation including status code and content checks
- Detailed debugging output for troubleshooting
- Failure handling options to suit different pipeline requirements

## Usage

Example use-case:

```yaml
version: 2.1

orbs:
  wait-for: nobari/wait-for@1.1.0

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

Wait for an HTTP endpoint to become available with advanced options for validation and configuration.

#### Required Parameters

| Parameter    | Type   | Description                                              |
|--------------|--------|----------------------------------------------------------|
| url          | string | The URL to poll (e.g., http://localhost:8080/health)     |
| service_name | string | A descriptive name for the service you're waiting for    |

#### Basic Configuration

| Parameter    | Type    | Default | Description                                           |
|--------------|---------|---------|-------------------------------------------------------|
| timeout      | integer | 120     | Maximum time to wait in seconds before failing        |
| interval     | integer | 5       | Interval between checks in seconds                    |
| verbose      | boolean | true    | Enable verbose output including debugging information |
| status_code  | integer | 200     | Expected HTTP status code to consider endpoint available |
| fail_on_error| boolean | true    | Whether to fail the build if endpoint doesn't become available within timeout |

#### HTTP Request Options

| Parameter    | Type    | Default | Description                                           |
|--------------|---------|---------|-------------------------------------------------------|
| method       | enum    | GET     | HTTP method to use (GET, POST, HEAD)                  |
| headers      | string  | ""      | Optional HTTP headers (format: 'Header-Name: value')  |
| body         | string  | ""      | Request body content for POST requests                |
| basic_auth   | string  | ""      | Basic authentication credentials (format: 'username:password') |
| proxy        | string  | ""      | Proxy URL to use for requests                         |

#### Security and Connection Settings

| Parameter       | Type    | Default | Description                                           |
|-----------------|---------|---------|-------------------------------------------------------|
| insecure        | boolean | false   | Skip SSL certificate validation for HTTPS requests    |
| ca_cert         | string  | ""      | Path to custom CA certificate for HTTPS verification  |
| connect_timeout | integer | 10      | Timeout for establishing connection in seconds        |
| follow_redirects| boolean | true    | Whether to follow HTTP redirects                      |

#### Response Validation

| Parameter            | Type    | Default | Description                                    |
|----------------------|---------|---------|------------------------------------------------|
| require_response_body| boolean | false   | Whether to require a non-empty response body   |
| response_contains    | string  | ""      | Text that must be present in response body     |
| max_retries          | integer | 0       | Maximum number of connection attempts before timeout. When 0, uses timeout/interval to determine max attempts |

## Advanced Examples

### Basic Endpoint Check with Timeout

```yaml
steps:
  - wait-for/wait_for_endpoint:
      url: "http://api.example.com/health"
      service_name: "Example API"
      timeout: 300
      interval: 5
```

### Authentication and Headers

```yaml
steps:
  - wait-for/wait_for_endpoint:
      url: "http://api.example.com/protected"
      service_name: "Auth API"
      headers: "Authorization: Bearer ${API_TOKEN}\nContent-Type: application/json"
      basic_auth: "username:${PASSWORD}"
```

### POST Request with Body

```yaml
steps:
  - wait-for/wait_for_endpoint:
      url: "http://api.example.com/login"
      service_name: "Login Service"
      method: POST
      body: '{"username": "test", "password": "test"}'
      status_code: 200
```

### Content Validation

```yaml
steps:
  - wait-for/wait_for_endpoint:
      url: "http://api.example.com/status"
      service_name: "Status Service"
      require_response_body: true
      response_contains: '"status":"ready"'
```

### Ignoring SSL Verification

```yaml
steps:
  - wait-for/wait_for_endpoint:
      url: "https://dev-api.example.com/health"
      service_name: "Dev API"
      insecure: true
```

### Custom Error Handling

```yaml
steps:
  - wait-for/wait_for_endpoint:
      url: "http://api.example.com/health"
      service_name: "Optional Service"
      fail_on_error: false
```

## Best Practices

1. **Appropriate Timeouts**: Set timeouts based on realistic service startup times. Default (120s) is suitable for most services, but complex systems may need longer.

2. **Descriptive Service Names**: Use clear, descriptive service names to make logs and error messages easier to interpret.

3. **Health Endpoints**: Target dedicated health or readiness endpoints that return quick responses, not endpoints that perform complex operations.

4. **Response Validation**: For more reliable tests, use `response_contains` to validate content, not just status codes.

5. **Security**: Use environment variables for sensitive information like tokens or passwords:
   ```yaml
   basic_auth: "${USERNAME}:${PASSWORD}"
   ```

6. **Debugging**: Leave `verbose: true` enabled in CI environments to aid in troubleshooting when endpoints fail to become available.

7. **Fail Fast**: Consider using `max_retries` for services that you know will either be available quickly or fail entirely.

## Development and Release Process

This section outlines the steps for developing, validating, and publishing new versions of the orb.

### Prerequisites

Ensure you have the CircleCI CLI installed and configured:

```bash
curl -fLSs https://raw.githubusercontent.com/CircleCI/local-cli/master/install.sh | bash
circleci setup
```

### Development Workflow

1. **Validate your orb locally**:
   ```bash
   # Pack the orb source files
   circleci orb pack src/ > orb.yml
   
   # Validate the orb
   circleci orb validate orb.yml
   ```

2. **Publish a development version**:
   ```bash
   # Publish to dev:latest
   circleci orb publish orb.yml nobari/wait-for@dev:latest
   ```
   Development versions expire after 90 days if not updated.

3. **Test the development version** in your CircleCI configuration:
   ```yaml
   orbs:
     wait-for: nobari/wait-for@dev:latest
   ```

### Release Process

Publishing follows semantic versioning principles:
- **Patch**: Bug fixes and minor changes (1.0.x)
- **Minor**: New features, non-breaking (1.x.0)
- **Major**: Breaking changes (x.0.0)

1. **Publish a patch release**:
   ```bash
   circleci orb publish promote nobari/wait-for@dev:latest patch
   ```

2. **Publish a minor release**:
   ```bash
   circleci orb publish promote nobari/wait-for@dev:latest minor
   ```

3. **Publish a major release**:
   ```bash
   circleci orb publish promote nobari/wait-for@dev:latest major
   ```

4. **Verify the published version**:
   ```bash
   circleci orb info nobari/wait-for
   ```

Remember that published versions are immutable and cannot be deleted or modified.

## Troubleshooting

### Common Issues

1. **Connection Refused**: Usually indicates the service isn't running or is on a different port/host.
   
2. **Timeout Errors**: The service may take longer to start than the configured timeout. Try increasing the timeout or investigating why the service is taking so long.

3. **SSL Certificate Issues**: For development environments, you may need to use `insecure: true`. For production, provide a proper `ca_cert`.

4. **Wrong Status Codes**: Ensure the `status_code` parameter matches what the endpoint actually returns when healthy.

### Debugging

When `verbose: true`, the orb outputs detailed debugging information including:
- Full curl command being executed
- Raw curl output including headers and response data
- Exit codes and status codes
- All configured parameter values

## Contributing

We welcome [issues](https://github.com/nobari/wait-for/issues) and [pull requests](https://github.com/nobari/wait-for/pulls) against this repository!

For significant changes, please open an issue first to discuss what you would like to change.

## License

[MIT License](LICENSE) 