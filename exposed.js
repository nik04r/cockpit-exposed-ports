document.addEventListener("DOMContentLoaded", loadExposedPorts);

async function loadExposedPorts() {
    try {
        // Run the 'ss -lntu' command with superuser privileges
        const output = await cockpit.spawn(["ss", "-lntu"], { superuser: true });
        const ports = parseSsOutput(output);
        renderPorts(ports);
    } catch (error) {
        console.error("Failed to load ports:", error);
        showError("Failed to retrieve open ports.");
    }
}

function parseSsOutput(output) {
    const lines = output.trim().split("\n").slice(1); // Skip header line

    return lines.reduce((ports, line) => {
        const cols = line.trim().split(/\s+/);
        if (cols.length < 6) return ports;

        const [proto, state, recvQ, sendQ, local, peer] = cols;

        const portMatch = local.match(/:(\d+)$/);
        if (!portMatch) return ports;

        const port = portMatch[1];

        ports.push({
            port,
            protocol: proto.toUpperCase(),
            service: lookupServiceName(port),
            status: "Open",
            state,
            recvQ,
            sendQ,
            localAddress: local,
            peerAddress: peer
        });

        return ports;
    }, []);
}

function lookupServiceName(port) {
    const services = {
        "22": "OpenSSH",
        "80": "HTTP",
        "443": "HTTPS",
        "3306": "MySQL",
        "5432": "PostgreSQL",
        "25": "SMTP",
        "21": "FTP",
        "9090": "Cockpit"
    };

    return services[port] || "Unknown";
}

function renderPorts(ports) {
    const tableBody = document.getElementById("port-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = ports.length === 0
        ? `<tr><td colspan="9">No open ports detected.</td></tr>`
        : ports.map(({ port, protocol, service, status, state, recvQ, sendQ, localAddress, peerAddress }) =>
            `<tr>
                <td>${port}</td>
                <td>${protocol}</td>
                <td>${service}</td>
                <td><span class="status-open">${status}</span></td>
                <td>${state}</td>
                <td>${recvQ}</td>
                <td>${sendQ}</td>
                <td>${localAddress}</td>
                <td>${peerAddress}</td>
            </tr>`
          ).join("");
}

function showError(message) {
    const tableBody = document.getElementById("port-table-body");
    if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="9" style="color:red;">${message}</td></tr>`;
    }
}
