import { loadWorkletRuntime as __loadWorkletRuntime } from "@lynx-js/react";
var loadWorkletRuntime = __loadWorkletRuntime;
let a = 1;
class App extends Component {
    onTapLepus = {
        _c: {
            a
        },
        _lepusWorkletHash: "a77b:test:1"
    };
}
loadWorkletRuntime(typeof globDynamicComponentEntry === 'undefined' ? undefined : globDynamicComponentEntry) && registerWorkletInternal("main-thread", "a77b:test:1", function(event) {
    let { a } = this["_c"];
    "main thread";
    console.log(a);
    console.log(this.a);
});
