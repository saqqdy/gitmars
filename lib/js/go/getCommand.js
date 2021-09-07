'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var inquirer = require('inquirer');
require('fs');
require('shelljs');
var colors = require('colors');
require('slash');
require('cosmiconfig');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var inquirer__default = /*#__PURE__*/_interopDefaultLegacy(inquirer);
var colors__default = /*#__PURE__*/_interopDefaultLegacy(colors);

function warning(txt) {
  return colors__default['default'].yellow(txt);
}

const createPrompt = (command, {
  options,
  validator,
  transform
}, type) => {
  if (type === 'checkbox') {
    if (!options.length) return null;
    let promptOpt = {
      type,
      message: '请选择',
      name: command,
      choices: [],
      validate: answer => {
        if (validator) {
          let msg = true;
          validator(answer, options, err => {
            if (err) msg = err.message;
          });
          return msg;
        }

        return true;
      }
    };
    options.forEach(option => {
      promptOpt.choices.push({
        name: option.description,
        value: option.long,
        checked: option.recommend
      });
    });
    return promptOpt;
  } else if (type === 'input') {
    let list = [];
    options.forEach(({
      validator: childValidator,
      transformer,
      ...opts
    }) => {
      if (childValidator) validator = childValidator;
      let cfg = {
        type: 'input',
        name: opts.name,
        message: `${opts.description || '请输入参数' + opts.name + '的值'}${!opts.required ? warning('(可不填' + (!['', undefined].includes(opts.defaultValue) ? '，默认"' + opts.defaultValue + '"' : '') + ')') : ''}`,
        transformer: (val, answers, flags) => {
          if (!transformer) {
            return val;
          } else if (transformer instanceof Function) {
            return transformer(val, answers, flags, opts);
          }
        },
        validate: val => {
          let msg = true;
          if (!val && opts.required) msg = '请填写' + opts.description;
          validator && msg === true && validator(val, opts, err => {
            if (err) msg = err.message;
          });
          return msg;
        }
      };
      if (opts.defaultValue !== '') cfg.defaultValue = opts.defaultValue;
      list.push(cfg);
    });
    return list;
  }
};

const getCommand = async ({
  command,
  args,
  options,
  validatorOpts,
  validatorArgs,
  transformOpts,
  transformArgs
}) => {
  let params = [],
      needInput = [];

  if (options.length > 0) {
    const needStep1 = options.some(option => !option.optional && !option.required || !option.recommend);

    if (needStep1) {
      const answer1 = await inquirer__default['default'].prompt(createPrompt(command, {
        options,
        validator: validatorOpts,
        transform: transformOpts
      }, 'checkbox'));
      const {
        [command]: selection
      } = answer1;
      selection.forEach(prop => {
        let option = options.find(opt => opt.long === prop);

        if (option.optional || option.required) {
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
      needInput = options.map(option => {
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
    const answer2 = await inquirer__default['default'].prompt(createPrompt(command, {
      options: args,
      validator: validatorArgs,
      transform: transformArgs
    }, 'input'));
    params = [].concat(Object.values(answer2)).concat(params);
  }

  if (needInput.length > 0) {
    const answer3 = await inquirer__default['default'].prompt(createPrompt(command, {
      options: needInput
    }, 'input'));
    let arr = Object.entries(answer3).map(item => {
      if (item[1] !== '') item[1] = '"' + item[1] + '"';
      return item;
    });
    params = params.concat(arr.flat(Infinity));
  }

  return Promise.resolve(`${params.join(' ').replace(/\s+/g, ' ').trim()}`);
};

exports['default'] = getCommand;
