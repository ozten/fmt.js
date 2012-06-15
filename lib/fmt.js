#!/usr/bin/env node
var fs = require('fs'),
    Reflect = require('reflect'),
    util = require('util');

var ast,
    src,
    lines,
    format,
    print,
    indnt = 0;

function indent () {
  var rv = '';
  for (var i=0; i < indnt; i++) {
    rv += ' ';
  }
  return rv;
}

exports.fmt = function (filename, cb) {
  fs.readFile(filename, function (err, src) {
    if (err) {
      cb(err);
    } else {
      ast = Reflect.parse(src.toString('utf8'));
      lines = src.toString('utf8').split('\n');
      cb(null, format(ast));
    }
  });
}

exports.print = print = function (chars) {
  process.stdout.write(chars);
}

exports.format = format = function (ast) {
  switch (ast.type) {
    case 'Program':
      var stmts = [];
      // Print #!/bin as well as header comments
      for (var i = 0; i < ast.loc.start.line - 1; i++) {
        if (lines[i].trim().length > 0) stmts.push(lines[i]);
      }
      for (var i=0; i< ast.body.length; i++) {
        stmts.push(format(ast.body[i]));
      }
      return stmts.join('');

  // require('./foo');
  case 'ExpressionStatement':
    return format(ast.expression) + ';\n';

  case 'ReturnStatement':
      return util.format('%sreturn %s;\n', indent(), format(ast.argument));

  // './foo'
  case 'Literal':
      if ('boolean' === typeof ast.value ||
	  'number' === typeof ast.value) {
	  return ast.value;

      } else if ('string' === typeof ast.value) {

          return util.format("'%s'", ast.value.replace("'", "\\'"));
      } else {
      console.log(typeof ast.value + '___' + ast.value);
	  throw 'Unknown Literal';
      }

  // foo
  case 'Identifier':
    return ast.name;

  // var foo = "bar",
  //     baz = 3;
  case 'VariableDeclaration':
    var vars = [];
    for (var i=0; i < ast.declarations.length; i++) {
	vars.push(indent() + format(ast.declarations[i]));
    }
    return util.format('var %s;\n', vars.join(',\n'));

  // foo = "bar";
  case 'VariableDeclarator':
      return util.format('%s = %s', format(ast.id), format(ast.init));

  // foo.bar()
  case 'MemberExpression':
    return util.format('%s.%s', format(ast.object), format(ast.property));

  // require('express')
  case 'CallExpression':
    // Note similarity to 'ExpressionStatement'
    var exp = ast;
    var args = [];
    for (var i=0; i < exp.arguments.length; i++) {
	args.push(format(exp.arguments[i]));
    }
    return util.format("%s(%s)", format(exp.callee), args.join(', '));

  // function foo (err, foo) {}
  case 'FunctionDeclaration':
    var params = [];
    ast.params.forEach(function (param) {
      params.push(format(param));
    });
    return util.format('function %s (%s) %s\n',
		       format(ast.id),
		       params.join(', '),
		       format(ast.body));

  // function (err, foo) {}
  case 'FunctionExpression':
    var func = 'function (%s)  %s';
    if (!! ast.id) {
      func = util.format('%sfunction %s (%%s) %%s;\n', indent(), format(ast.id));
    }
    var params = [];
    for (var i=0; i < ast.params.length; i++) {
      params.push(format(ast.params[i]));      
    }
    return util.format(func, params.join(', '), format(ast.body));

  case 'AssignmentExpression':
      return util.format('%s%s%s', format(ast.left), ast.operator, format(ast.right));

  case 'ObjectExpression':
      var props = [];
      indnt += 2;
      for (var i=0; i < ast.properties.length; i++) {
	  // TODO logic to chosoe between flavor: and "flavor-of-the-month":
	  props.push(util.format('%s"%s": %s', 
				 indent(),
				 ast.properties[i].key.name,
				 format(ast.properties[i].value)));
				 
      }
      indnt -= 2;
      return util.format('{%s}', props.join(',\n'));

  // {
  //   var foo = 'bar';
  //   return foo;
  // }
  case 'BlockStatement':
    var stmts = [];
    indnt +=2;
    for (var i=0; i < ast.body.length; i++) {
      stmts.push(indent() + format(ast.body[i]));
    }
    indnt -=2;
    return util.format('%s{\n%s\n%s}', indent(), stmts.join('\n'), indent());

  // if (! true) process.exit(1);
  case 'IfStatement':
    var test_fmt;
    if (ast.alternate) {
	test_fmt = '%sif (%s) %s else %s';
        return util.format(test_fmt,
			   indent(),
			   format(ast.test),
			   format(ast.consequent),
			   format(ast.alternate));
    } else {
	test_fmt = '%sif (%s) { %s }';
        return util.format(test_fmt,
			   indent(),
			   format(ast.test),
			   format(ast.consequent));
    }

  // try { foo(); } catch (e) { console.log(e); } finally {...}
  case 'TryStatement':
    var trycatch = util.format('try %s %s',
			       format(ast.block),
			       format(ast.handler));

    if (!! ast.handler.finalizer) {
	trycatch += util.format('finally %s',
				format(ast.handler.finalizer));
    }
    return trycatch;

  // catch (e) { console.log(e); }
  case 'CatchClause':
    if (!! ast.guard) {
      console.log('Unknown property guard! TODO:', ast.guard);
    }

    return util.format('catch (%s) %s',
		       format(ast.param),
		       format(ast.body));
  // foo ? foo : {}
  case 'ConditionalExpression':
    return util.format('%s ? %s : %s',
		       format(ast.test),
		       format(ast.consequent),
		       format(ast.alternate));

  case 'UnaryExpression':
    return util.format('%s %s',
			 ast.operator,
  			 format(ast.argument));
  case 'BinaryExpression':
    return util.format('%s %s %s',
		       format(ast.left),
		       ast.operator,
		       format(ast.right));
    break;

  default:
    console.log('UNKNOWN:', ast.type);
    break;
  }
};