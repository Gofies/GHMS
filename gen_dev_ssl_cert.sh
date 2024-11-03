#!/bin/bash

# Script to generate self-signed SSL certificate
# Usage: ./generate_ssl_cert.sh

# Exit on any error
set -e

# Configuration variables
DOMAIN="localhost"
COUNTRY="TR"
STATE="Istanbul"
LOCALITY="Istanbul"
ORGANIZATION="itu"
ORGANIZATIONAL_UNIT="itu"
EMAIL="dummy@ssl.com"
KEY_FILE="yourdomain.key"
CERT_FILE="fullchain.pem"
DAYS_VALID=365
KEY_SIZE=2048

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo_success() {
    echo -e "${GREEN}$1${NC}"
}

echo_error() {
    echo -e "${RED}$1${NC}"
}

# Check if OpenSSL is installed
if ! command -v openssl &> /dev/null; then
    echo_error "OpenSSL is not installed. Please install it first."
    exit 1
fi

# Generate private key
echo "Generating private key..."
if openssl genrsa -out "$KEY_FILE" "$KEY_SIZE"; then
    echo_success "Private key generated successfully: $KEY_FILE"
else
    echo_error "Failed to generate private key"
    exit 1
fi

# Create config file for certificate generation
cat > openssl.cnf << EOF
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
C = ${COUNTRY}
ST = ${STATE}
L = ${LOCALITY}
O = ${ORGANIZATION}
OU = ${ORGANIZATIONAL_UNIT}
CN = ${DOMAIN}
emailAddress = ${EMAIL}

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = ${DOMAIN}
EOF

# Generate certificate using config file
echo "Generating self-signed certificate..."
if openssl req -new -x509 \
    -key "$KEY_FILE" \
    -out "$CERT_FILE" \
    -days "$DAYS_VALID" \
    -config openssl.cnf; then
    echo_success "Certificate generated successfully: $CERT_FILE"
else
    echo_error "Failed to generate certificate"
    exit 1
fi

# Display certificate information
echo "Certificate information:"
if openssl x509 -in "$CERT_FILE" -text -noout; then
    echo_success "Certificate details displayed successfully"
else
    echo_error "Failed to display certificate details"
    exit 1
fi

# Clean up the config file
rm openssl.cnf

echo_success "SSL certificate generation completed successfully!"
echo_success "Private key: $KEY_FILE"
echo_success "Certificate: $CERT_FILE"

mv $KEY_FILE ssl/$KEY_FILE
mv $CERT_FILE ssl/$CERT_FILE