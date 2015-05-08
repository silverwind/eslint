/**
 * @fileoverview Rule to flag wrapping non-iife in parens
 * @author Gyandeep Singh
 * @copyright 2015 Gyandeep Singh. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var config = context.options[0] || {};
    var checkGetWithoutSet = config.getWithoutSet === true;
    var checkSetWithoutGet = config.setWithoutGet !== false;

    /**
     * Checks a object expression to see if it has setter and getter both present or none.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     * @private
     */
    function checkLonelySetGet(node) {
        var isSetPresent = node.properties.some(function(prop) {
            if (prop.kind === "set") {
                return true;
            } else if (prop.kind === "init") {
                if (prop.key.name === "set") {
                    return true;
                }
            }
            return false;
        });

        var isGetPresent = node.properties.some(function(prop) {
            if (prop.kind === "get") {
                return true;
            } else if (prop.kind === "init") {
                if (prop.key.name === "get") {
                    return true;
                }
            }
            return false;
        });

        if (checkSetWithoutGet && isSetPresent && !isGetPresent) {
            context.report(node, "Getter is not present");
        } else if (checkGetWithoutSet && isGetPresent && !isSetPresent) {
            context.report(node, "Setter is not present");
        }
    }

    return {
        "ObjectExpression": checkLonelySetGet
    };

};
