const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

exports.extractIPv4 = (ip) =>
  ip.includes("::ffff:") ? ip.split("::ffff:")[1] : ip;

exports.getMacAddress = async (ip) => {
  const ipv4 = this.extractIPv4(ip);
  const { stdout } = await execAsync(`arp -a ${ipv4}`);
  const match = stdout.match(/([a-f0-9]{2}[:|\-]?){6}/i);
  if (!match) throw new Error("MAC not found");
  return match[0];
};
