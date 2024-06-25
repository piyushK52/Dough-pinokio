const { execSync } = require("child_process");
const { virtual_env, project_dir } = require("./constants");

function hasSudo() {
  try {
    execSync("sudo -n true", { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

function getInstallCommand(kernel) {
  const { platform, gpu } = kernel;

  function combineLists(list1, list2) {
    return [...list1, ...list2];
  }

  project_requirements = [
    "pip install -r requirements.txt",
    "pip install -r comfy_runner/requirements.txt",
    "pip install -r ComfyUI/requirements.txt",
  ];

  // only handling linux and win32 for now
  if (platform == "linux") {
    if (hasSudo()) {
      cmd_list = [
        "sudo apt-get update && sudo apt-get install -y libpq-dev python3.10-dev",
      ];
    } else {
      cmd_list = [
        "apt-get update && apt-get install -y libpq-dev python3.10-dev",
      ];
    }

    return combineLists(cmd_list, project_requirements);
  }

  if (platform == "win32") {
    cmd_list = [
      "python.exe -m pip install --upgrade pip",
      "pip install websocket",
      "pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118",
    ];

    return combineLists(cmd_list, project_requirements);
  }

  return [
    "conda install libsqlite --force-reinstall -y", // mac issue with sqlite3 package
    "pip install -r requirements.txt",
  ];
}

module.exports = async (kernel) => {
  const config = {
    run: [
      {
        method: "shell.run",
        params: {
          message: [
            "git clone --depth 1 -b main https://github.com/banodoco/Dough.git ${project_dir}",
          ],
        },
      },
      {
        method: "shell.run",
        params: {
          path: project_dir,
          message: [
            "git clone --depth 1 -b main https://github.com/piyushK52/comfy_runner.git",
            "git clone https://github.com/comfyanonymous/ComfyUI.git",
          ],
        },
      },
      {
        method: "shell.run",
        params: {
          path: project_dir,
          venv: virtual_env,
          message: getInstallCommand(kernel),
        },
      },
      {
        method: "fs.copy",
        params: {
          src: project_dir + "/.env.sample",
          dest: project_dir + "/.env",
        },
      },
      {
        method: "input",
        params: {
          title: "Install complete",
          description: "Go back to the dashboard to launch the application.",
        },
      },
    ],
  };

  return config;
};
