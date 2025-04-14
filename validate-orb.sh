#!/bin/bash

# Exit on error
set -e

echo "Packing the orb..."
circleci orb pack src/ > orb.yml

echo "Validating the orb..."
circleci orb validate orb.yml

echo "Checking the current orb version..."
circleci orb info nobari/wait-for 