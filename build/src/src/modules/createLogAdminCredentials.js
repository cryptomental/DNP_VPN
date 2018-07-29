const qrcode = require('qrcode-terminal');


function createLogAdminCredentials(
  credentialsFile,
  generate
) {
  return async function logAdminCredentials(VPN) {
    let deviceList = await credentialsFile.fetch();
    let adminDevice = deviceList[0];
    let adminOtp = generate.otp(adminDevice.name, adminDevice.password, VPN);

    // Show the QR code
    qrcode.setErrorLevel('S');
    qrcode.generate(adminOtp);

    // Show credentials
    /* eslint-disable max-len */
    let msg = `
    To connect to your DAppNode scan the QR above, copy/paste link below into your browser or use VPN credentials:
  
    ${adminOtp}
  
     VPN-Type         IP               PSK                name             password
    L2TP/IPSec  ${VPN.IP}  ${VPN.PSK}  ${adminDevice.name}  ${adminDevice.password}`;

    if (VPN.UPNP_STATUS.openPorts && !VPN.UPNP_STATUS.UPnP) {
      // UPNP_STATUS: {
      //   openPorts: true, // true => ports have to be opened
      //   UPnP: true, // true => UPnP is able to open them automatically
      //   msg: 'UPnP device available',
      // },
      msg += '\n ALERT: You may not be able to connect. Turn your router\'s UPnP on or open the VPN ports (500 and 4500) manually';
    }
    if (!VPN.EXTERNALIP_STATUS.externalIpResolves) {
      // EXTERNALIP_STATUS: {
      //   externalIpResolves: true,
      //   INT_IP: INT_IP,
      // }
      msg += '\n ALERT: (NAT-Loopback disable) If you are connecting from the same network as your DAppNode use the internal IP: '+VPN.EXTERNALIP_STATUS.INT_IP;
    }
    /* eslint-enable max-len */

    /* eslint-disable no-console */
    console.log(msg);
    /* eslint-enable no-console */
  };
}


module.exports = createLogAdminCredentials;
