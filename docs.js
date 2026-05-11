      const tools = [
        {
          slug: "nmap",
          name: "Nmap (Network Mapper)",
          description:
            "Nmap is an open-source utility for network exploration and security auditing. It is designed to rapidly scan large networks, although it works fine against single hosts. Nmap uses raw IP packets in novel ways to determine what hosts are available on the network, what services (application name and version) those hosts are offering, what operating systems (and OS versions) they are running, what type of packet filters/firewalls are in use, and dozens of other characteristics. It is the industry standard for mapping network topology and discovering the attack surface of any target infrastructure.",
          tags: [
            "Reconnaissance",
            "Port Scanning",
            "OS Fingerprinting",
            "Vulnerability Discovery",
          ],
          examples: [
            "Advanced Service Detection: nmap -sV -sC -O target_ip - This command attempts to determine service versions, run default scripts for vulnerability checking, and identify the remote operating system.",
            "Stealth SYN Scan: nmap -sS -T4 -p- target_ip - A high-speed stealth scan that checks all 65,535 ports while minimizing the chance of triggering alert logs on basic firewalls.",
          ],
          protection:
            "To defend against unauthorized Nmap scans, administrators should implement 'Deny by Default' firewall policies, utilize Intrusion Prevention Systems (IPS) that detect port-sweeping patterns, and configure 'Port Knocking' or VPN-only access for sensitive management services.",
          remediation:
            "If a scan is detected from a suspicious IP, immediately null-route the source IP at the edge firewall, review internal logs for subsequent lateral movement attempts, and ensure all services identified as 'open' are fully patched and hardened.",
        },
        {
          slug: "wireshark",
          name: "Wireshark (Packet Analyzer)",
          description:
            "Wireshark is the world’s foremost and widely-used network protocol analyzer. It lets you see what’s happening on your network at a microscopic level and is the de facto standard across many commercial and non-profit enterprises, government agencies, and educational institutions. Wireshark performs deep inspection of hundreds of protocols, with more being added all the time. It supports live capture and offline analysis, allowing investigators to reconstruct entire TCP sessions, extract transmitted files, and identify malicious payloads or data exfiltration attempts through unconventional protocols.",
          tags: [
            "Packet Sniffing",
            "Protocol Analysis",
            "Forensics",
            "Troubleshooting",
          ],
          examples: [
            "HTTP Traffic Inspection: Using the filter 'http.request' to isolate all outgoing web requests, allowing an analyst to see headers, cookies, and POST data sent by an infected host.",
            "Suspicious DNS Analysis: Filtering by 'dns.flags.response == 0' to identify high-frequency DNS queries which might indicate DNS tunneling or Command and Control (C2) beaconing.",
          ],
          protection:
            "The primary defense against packet sniffing is universal encryption. Enforce TLS 1.3 for all web traffic, use SSH instead of Telnet, and implement IPsec for internal server-to-server communication to ensure captured data remains unreadable.",
          remediation:
            "Upon discovering cleartext sensitive data in network captures, immediately revoke and rotate all compromised credentials, upgrade the affected services to encrypted versions, and audit the network for unauthorized 'Promiscuous Mode' adapters.",
        },
        {
          slug: "metasploit",
          name: "Metasploit Framework",
          description:
            "The Metasploit Framework is a powerful tool used by network administrators and security specialists to detect vulnerabilities, exploit them, and document security flaws. It provides a massive database of world-class exploits, payloads, and post-exploitation modules. Metasploit allows Red Teams to simulate sophisticated attacks, from initial compromise via buffer overflows to lateral movement using pass-the-hash techniques. It is an essential environment for validating whether a vulnerability is truly exploitable and for testing the effectiveness of EDR (Endpoint Detection and Response) solutions.",
          tags: [
            "Exploitation",
            "Penetration Testing",
            "Payload Generation",
            "Post-Exploitation",
          ],
          examples: [
            "Automated Vulnerability Validation: Utilizing the 'check' command in various modules to verify if a target is susceptible to a specific CVE without actually launching the exploit.",
            "Meterpreter Deployment: Generating a staged reverse-TCP payload that provides an interactive command shell with advanced features like screen grabbing, keylogging, and privilege escalation.",
          ],
          protection:
            "Defense involves a multi-layered approach: rigorous Patch Management to close known CVEs, Application Whitelisting to prevent the execution of untrusted payloads, and Host-based Intrusion Detection Systems (HIDS) to monitor for suspicious process injections.",
          remediation:
            "If a Metasploit-based compromise is confirmed, isolate the host from the network immediately. Perform a full forensic memory dump to identify the resident payload, wipe the system, and restore from a known-clean backup while closing the initial entry vector.",
        },
        {
          slug: "encrypt",
          name: "Encryption Tool (Core)",
          description:
            "This module utilizes industry-standard AES-256 (Advanced Encryption Standard) in GCM mode to ensure the highest level of data confidentiality and integrity. Encryption transforms readable data (plaintext) into an unreadable format (ciphertext) using a secret mathematical key. Without the specific key, the data is computationally impossible to decipher even with current supercomputing power. This tool is designed for securing local files, sensitive database exports, and archives before they are moved to cloud storage or transmitted over untrusted networks.",
          tags: ["Confidentiality", "AES-256", "Data at Rest", "Cryptography"],
          examples: [
            "Folder Hardening: Encrypting entire project directories containing proprietary source code before uploading them to public version control systems.",
            "Credential Archiving: Securing a local database of administrative passwords using a master key derived from a high-entropy passphrase.",
          ],
          protection:
            "The strength of encryption lies in Key Management. Use hardware security modules (HSM) or secure key vaults, and ensure that passphrases meet high complexity requirements to prevent 'Brute Force' or 'Dictionary' attacks.",
          remediation:
            "If encrypted data is stolen but the key remains secure, the data is safe. However, if the key is compromised, consider the data breached: rotate all keys immediately, re-encrypt data with new parameters, and investigate the source of the key leak.",
        },
        {
          slug: "decrypt",
          name: "Decryption Tool (Core)",
          description:
            "The Decryption module is the authorized counterpart to the Encryption tool. It facilitates the restoration of ciphertext back into its original plaintext form. It requires the exact cryptographic key or passphrase used during the initial encryption process. The tool includes integrity checks (such as HMAC or GCM tags) to ensure that the encrypted file has not been tampered with or corrupted during storage or transit. If even a single bit of the ciphertext is altered, the decryption process will fail, alerting the user to a potential security compromise.",
          tags: [
            "Data Recovery",
            "Integrity Verification",
            "Authorized Access",
          ],
          examples: [
            "Secure Archive Retrieval: Restoring encrypted legal documents retrieved from off-site cold storage for an active audit.",
            "Safe Communication: Decrypting a sensitive configuration file sent by a remote administrator through a pre-shared secure channel.",
          ],
          protection:
            "Implement 'Multi-Factor Decryption' where possible, requiring both a physical token (keyfile) and a memorized secret (passphrase) to unlock the most sensitive data sets.",
          remediation:
            "In cases of failed decryption attempts, investigate for file system corruption or active tampering. If unauthorized decryption is suspected, audit the 'Key Access Logs' and revoke the current key pair immediately.",
        },
        {
          slug: "keylogger",
          name: "Keylogger (Educational Concept)",
          description:
            "A Keylogger is a type of surveillance software that has the capability to record every keystroke made on a computer. While often associated with malware, understanding the mechanics of keylogging—such as API hooking (SetWindowsHookEx) and direct kernel-level monitoring—is vital for developing defensive software. This documentation covers how these tools operate at the OS level to capture credentials, personal messages, and sensitive commands, highlighting the vulnerability of the human-computer interface.",
          tags: ["Spyware Analysis", "Endpoint Security", "User Monitoring"],
          examples: [
            "Defense Simulation: Running a controlled keylogger in a sandbox to observe how modern Antivirus/EDR solutions flag 'low-level keyboard hooks'.",
            "Awareness Training: Demonstrating to employees how a simple unverified attachment can lead to total credential theft via background keystroke logging.",
          ],
          protection:
            "Deploy robust Endpoint Protection (EPP) that monitors for suspicious system hooks, use Virtual Keyboards for ultra-sensitive entries, and always enforce Multi-Factor Authentication (MFA) to render stolen passwords useless.",
          remediation:
            "If a keylogger is found on a workstation, consider the device fully compromised. Wipe the machine, change ALL passwords used on that device from a different 'clean' machine, and check for unauthorized login attempts on corporate accounts.",
        },
        {
          slug: "network-scan",
          name: "Network Scanner (Quick Discovery)",
          description:
            "The Network Scanner is an optimized tool for rapid asset discovery and inventory. It focuses on identifying all active IP addresses, MAC addresses, and vendor information within a given CIDR range. Unlike Nmap, which is deep and slow, this scanner is designed for real-time monitoring—allowing administrators to instantly see when a new, unauthorized device connects to the network. It is an essential first step in the 'Identify' phase of the NIST cybersecurity framework.",
          tags: ["Asset Inventory", "ARP Scanning", "Shadow IT Detection"],
          examples: [
            "Shadow IT Discovery: Scanning the corporate Wi-Fi every 10 minutes to detect unauthorized personal laptops or mobile devices.",
            "IP Conflict Resolution: Identifying which MAC addresses are claiming specific static IPs during a network outage.",
          ],
          protection:
            "Implement Network Access Control (NAC) solutions like 802.1X to prevent any device from communicating on the network unless it is pre-authorized via a digital certificate or valid credentials.",
          remediation:
            "When an unknown device is detected, immediately isolate its switch port or block its MAC address at the Wireless LAN Controller (WLC). Conduct a physical search or use signal-strength tracking to locate and remove the rogue device.",
        },
        {
          slug: "arp-spoofing",
          name: "ARP Spoofing (Technical Concept)",
          description:
            "Address Resolution Protocol (ARP) Spoofing is a technique by which an attacker sends spoofed ARP messages onto a local area network. This results in the linking of an attacker's MAC address with the IP address of a legitimate server or gateway on the network. Once the attacker's MAC address is linked to an authentic IP address, the attacker can begin receiving any data that is intended for that IP address. ARP spoofing can enable Man-in-the-Middle (MitM) attacks, allowing the attacker to intercept, modify, or stop data in-transit.",
          tags: ["Man-in-the-Middle", "Layer 2 Attack", "Packet Interception"],
          examples: [
            "Gateway Impersonation: Forcing all traffic from a victim's machine to pass through the attacker's laptop before reaching the internet router.",
            "Session Hijacking: Intercepting unencrypted session cookies by positioning the attack machine between the user and the local web server.",
          ],
          protection:
            "The most effective defenses are 'Dynamic ARP Inspection' (DAI) on managed switches, which validates ARP packets against a trusted database, and the use of 'Static ARP' entries for critical infrastructure like servers and gateways.",
          remediation:
            "If an ARP attack is in progress, clear the ARP cache on affected machines (arp -d *) and enable DAI on the network switch immediately. Identify the port originating the spoofed traffic and shut it down.",
        },
        {
          slug: "track-website",
          name: "Website Tracker (OSINT)",
          description:
            "The Website Tracker is an Open Source Intelligence (OSINT) tool designed to aggregate public information about any web domain. It queries DNS records (A, MX, TXT, NS), identifies the hosting provider, analyzes SSL/TLS certificate chains, and checks for common misconfigurations like exposed subdomains or open directories. This tool is vital for 'External Attack Surface Management' (EASM), helping organizations see what an attacker sees before they launch an assault.",
          tags: ["OSINT", "Domain Analysis", "DNS Enumeration", "EASM"],
          examples: [
            "Subdomain Takeover Check: Identifying DNS records pointing to expired cloud services (like old AWS S3 buckets) that an attacker could reclaim.",
            "Security Header Audit: Analyzing if a target website uses 'HSTS', 'CSP', and 'X-Frame-Options' to protect its visitors.",
          ],
          protection:
            "Regularly audit your public DNS records to remove obsolete entries. Use 'WHOIS Privacy' services to hide administrative contact details and monitor for 'Typosquatting' domains that mimic your brand.",
          remediation:
            "If a vulnerability is found (e.g., an expired SSL certificate or exposed staging subdomain), immediately update the certificate or pull the subdomain offline. Review DNS logs for any unauthorized changes.",
        },
        {
          slug: "track-phone",
          name: "Phone Tracker (Intelligence)",
          description:
            "The Phone Tracker tool utilizes global telecommunication databases to provide metadata about a specific phone number. This includes the registered carrier, the geographical region of issuance, and the line type (Landline, Mobile, VoIP). In a security context, this is used for fraud prevention—identifying if a login attempt is using a 'throwaway' VoIP number often associated with botnets and scammers—and for verifying the legitimacy of communication sources during social engineering investigations.",
          tags: ["Telecom OSINT", "Fraud Prevention", "Number Verification"],
          examples: [
            "Spam Source Identification: Checking if a suspicious SMS link originated from a high-risk international carrier or a virtual number service.",
            "Business Verification: Confirming that a contact number provided in a wire transfer request matches the expected region and carrier of the legitimate vendor.",
          ],
          protection:
            "To protect your personal data, avoid linking your primary phone number to public social media profiles. Use 'Alias' numbers or VoIP services for non-critical online registrations to minimize your digital footprint.",
          remediation:
            "If a phone number is identified as part of a phishing campaign, report it to the relevant carrier and global 'Scam Call' databases. Block the number at the corporate PBX or mobile device level.",
        },
      ];

      const toolsList = document.getElementById("tools-list");
      const content = document.getElementById("content");
      const sidebar = document.getElementById("sidebar");

      tools.forEach((tool) => {
        const item = document.createElement("div");
        item.className = "tool-item";
        item.textContent = tool.name;
        item.onclick = (e) => loadTool(tool.slug, e);
        toolsList.appendChild(item);
      });

      function toggleSidebar() {
        sidebar.classList.toggle("open");
      }

      function loadTool(slug, event) {
        if (window.innerWidth <= 850) sidebar.classList.remove("open");

        document
          .querySelectorAll(".tool-item")
          .forEach((i) => i.classList.remove("active"));
        event.currentTarget.classList.add("active");

        const tool = tools.find((t) => t.slug === slug);
        content.classList.remove("show");

        setTimeout(() => {
          content.innerHTML = `
            <h1 class="tool-title">${tool.name}</h1>
            <p class="description">${tool.description}</p>
            
            <h3 class="section-title"><i class="fas fa-tags"></i> Core Capabilities</h3>
            <div style="margin-bottom: 20px;">
                ${tool.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
            </div>

            <h3 class="section-title"><i class="fas fa-terminal"></i> Technical Examples & Use Cases</h3>
            ${tool.examples.map((e) => `<div class="example-box">${e}</div>`).join("")}

            <h3 class="section-title"><i class="fas fa-shield-alt"></i> Defensive Measures (Protection)</h3>
            <div class="example-box" style="background: rgba(45, 255, 100, 0.05); border-color: rgba(45, 255, 100, 0.2); color: #fff;">
                ${tool.protection}
            </div>

            <h3 class="section-title"><i class="fas fa-tools"></i> Incident Remediation</h3>
            <div class="example-box" style="background: rgba(255, 45, 57, 0.05); border-color: rgba(255, 45, 57, 0.2); color: #fff;">
                ${tool.remediation}
            </div>

            <div class="btns">
              <a href="https://red-phantom-chat-bot-mb2i.vercel.app/" class="action-btn">Learn More</a>
              <a href="#" class="action-btn" style="background: #fff; color: #000;">Launch Tool</a>
            </div>
          `;
          content.classList.add("show");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 200);
      }
