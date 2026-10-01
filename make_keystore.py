import datetime
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.serialization import pkcs12, BestAvailableEncryption

key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048,
)

subject = issuer = x509.Name([
    x509.NameAttribute(NameOID.COMMON_NAME, "Cleanz24"),
    x509.NameAttribute(NameOID.ORGANIZATION_NAME, "Cleanz24"),
    x509.NameAttribute(NameOID.ORGANIZATIONAL_UNIT_NAME, "Mobile"),
    x509.NameAttribute(NameOID.LOCALITY_NAME, "Noida"),
    x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "Uttar Pradesh"),
    x509.NameAttribute(NameOID.COUNTRY_NAME, "IN"),
])

cert = x509.CertificateBuilder().subject_name(
    subject
).issuer_name(
    issuer
).public_key(
    key.public_key()
).serial_number(
    x509.random_serial_number()
).not_valid_before(
    datetime.datetime.now(datetime.timezone.utc)
).not_valid_after(
    datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=365 * 30)
).add_extension(
    x509.BasicConstraints(ca=True, path_length=None), critical=True,
).sign(key, hashes.SHA256())

p12 = pkcs12.serialize_key_and_certificates(
    name=b"cleanz24",
    key=key,
    cert=cert,
    cas=None,
    encryption_algorithm=BestAvailableEncryption(b"cleanz24pass")
)

with open("android/app/cleanz24-release.keystore", "wb") as f:
    f.write(p12)

print("Keystore cleanz24-release.keystore generated successfully!")
