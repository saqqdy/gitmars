'use strict';

const inquirer = require("inquirer");
const createPrompt = require("./createPrompt");
const getCommand = async ({
  command,
  args,
  options,
  validatorOpts,
  validatorArgs,
  transformOpts,
  transformArgs
}) => {
  let params = [], needInput = [];
  if (options.length > 0) {
    const needStep1 = options.some((option) => !option.optional && !option.required || !option.recommend);
    if (needStep1) {
      const answer1 = await inquirer.prompt(createPrompt(command, {
        options,
        validator: validatorOpts,
        transform: transformOpts
      }, "checkbox"));
      const { [command]: selection } = answer1;
      selection.forEach((prop) => {
        const option = options.find((opt) => opt.long === prop);
        if (option && (option.optional || option.required)) {
          needInput.push({
            required: option.required,
            name: option.long,
            variadic: false,
            defaultValue: option.defaultValue,
            description: option.description
          });
        } else {
          params.push(prop);
        }
      });
    } else {
      needInput = options.map((option) => {
        return {
          required: option.required,
          name: option.long,
          variadic: false,
          defaultValue: option.defaultValue,
          description: option.description
        };
      });
    }
  }
  if (args.length > 0) {
    const answer2 = await inquirer.prompt(createPrompt(command, {
      options: args,
      validator: validatorArgs,
      transform: transformArgs
    }, "input"));
    params = Object.values(answer2).concat(params);
  }
  if (needInput.length > 0) {
    const answer3 = await inquirer.prompt(createPrompt(command, { options: needInput }, "input"));
    const arr = Object.entries(answer3).map((item) => {
      if (item[1] !== "")
        item[1] = '"' + item[1] + '"';
      return item;
    });
    params = params.concat(arr.flat(Infinity));
  }
  return Promise.resolve(`${params.join(" ").replace(/\s+/g, " ").trim()}`);
};
module.exports = getCommand;
