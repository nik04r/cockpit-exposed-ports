# cockpit-exposed-ports

**Cockpit Exposed Ports Addon**  
A simple Cockpit plugin that lists open TCP/UDP ports using `ss`.

## Requirements

- Cockpit (v266 or newer)
- `ss` command (usually comes with `iproute2` package)
## Installation

1. **Install Cockpit**  
On Debian/Ubuntu-based systems:
   ```bash
   sudo apt install cockpit
2. **Create plugin directory**
   ```bash
   sudo mkdir -p /usr/share/cockpit/exposed-ports

3. **Copy repository contents**
Clone this repository and copy its contents:
   ```bash
   git clone https://github.com/nik04r/cockpit-exposed-ports.git
   sudo cp -r cockpit-exposed-ports/* /usr/share/cockpit/exposed-ports/
4. **Access in Cockpit**
Open your browser and go to:
   ```
   https://<your-server-ip>:9090
You should see "Exposed Ports" in the sidebar.
![Screenshot](images/screenshot.png)
