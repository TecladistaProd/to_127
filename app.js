const app = require("express")();
const proxy = require("http-proxy-middleware");

module.exports = () => {
  const args = require("minimist")(process.argv.slice(2));
  console.log(args);
  if (args.help || args.h) {
    return console.log(
      [
        "Help Command",
        "--help or -h to see help",
        "--version or -v to see module version",
        "--web or -w to put website you want to proxy",
        "--port or -p to put port you want to use, if it is not referenced will use port 3001",
        "url should use http(s)://",
        "example: to_127 -w https://mypage.github.io -p 5400"
      ].join("\r\n  ")
    );
  }

  if (args.version || args.v) {
    return console.log(require("./package.json").version);
  }
  let port = args.p || args.port || 3001;
  let web;
  try {
    web = handleError("--web or -w", args.w || args.web, "string");
  } catch (err) {
    return console.error(err);
  }

  app.use(
    "/",
    proxy({
      target: web,
      changeOrigin: true,
      ws: true
    })
  );

  app.listen(port, () =>
    console.log(`Listening website: ${web} on port: ${port}`)
  );
};

function handleError(name, arg, type) {
  if (!arg)
    throw new Error(`To this module work you should use this argument ${name}`);
  else if (arg && typeof arg !== type)
    throw new Error(`You should to pass a valid url to ${name}`);
  else if (!arg.match(/^http(s)?:\/\/\S+\.+\S+/gi))
    throw new Error(`the valid format to url should use http(s)://`);
  else return arg;
}
