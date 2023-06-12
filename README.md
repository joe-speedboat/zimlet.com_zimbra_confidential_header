# Confidential Header Zimlet

The Confidential Header Zimlet is a Zimbra extension that allows users to add and view the Confidential/Sensitivity Header based on RFC2156.

## Description

This Zimlet adds a customizable infobar to the message view, indicating the sensitivity level of the email. It also provides a sensitivity button in the compose toolbar, allowing users to set the sensitivity level for outgoing emails.

## Installation

1. Download the Zimlet package (`com_zimbra_confidential_header.zip`) from the [releases page](https://github.com/your-username/your-repo/releases).
2. Log in to your Zimbra server as an administrator.
3. Navigate to the **Admin Console**.
4. Go to **Zimlets**.
5. Click on **Install Zimlet**.
6. Select the downloaded `com_zimbra_confidential_header.zip` file.
7. Tick the "Flush Cache" checkbox.
8. Click on **OK** to install the Zimlet.

## Usage

### Viewing Sensitivity in Message View

When viewing an email, the sensitivity level will be displayed in an infobar at the top of the message view. The infobar will show the corresponding sensitivity icon and text based on the sensitivity level of the email.

### Setting Sensitivity in Compose View

When composing a new email or replying to an email, the compose toolbar will include a sensitivity button. Clicking on the sensitivity button will open a menu with different sensitivity options. Select the desired sensitivity level for the email from the menu.

### Sensitivity Levels

The Zimlet supports the following sensitivity levels:

- Normal
- Company-Confidential
- Personal
- Private

## Development

To build and customize the Confidential Header Zimlet, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/your-repo.git`
2. Modify the Zimlet files in the `zimlet/com_zimbra_confidential_header` directory to add or modify functionality.
3. Update the Zimlet version and other details in the `zimlet/com_zimbra_confidential_header/com_zimbra_confidential_header.xml` file.
4. Build the Zimlet package: `make`
5. The built Zimlet package (`com_zimbra_confidential_header.zip`) will be available in the `build` directory.
6. Follow the installation instructions above to install the modified Zimlet package on your Zimbra server.

## Contributions

Contributions to the Confidential Header Zimlet are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

The Confidential Header Zimlet is released under the [MIT License](https://opensource.org/licenses/MIT).

