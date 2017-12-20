# Cone Playground
This code enables the use of a web browser to create and run Cone programs,
thereby avoiding the need to first install the [Cone compiler][cone].
It also supports the generation of assembler output, LLVM IR, or Github-hosted code gists.

The web front-end makes use of the [Ace High-Performance Code Editor for the Web][ace] for program editing.
The other .html, .css, and .js files are adapted from the Pony playground, which in turn
adapted them from an [earlier version of the Rust playground][rustplay].

## License

These tools are distributed under the terms of multiple licenses,
depending on the original source for the code. 
See LICENSE for details.

[cone]: http://github.com/jondgoodwin/cone
[ace]: https://ace.c9.io/
[rustplay]: https://github.com/rust-lang/rust-playpen
