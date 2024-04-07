
import secrets

# Define the characters to choose from


secret_key = secrets.token_hex(32)  # 32 bytes = 64 characters

print("Generated Secret Key:", secret_key)