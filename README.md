# terminalarg

A playful, browser-based mock terminal and virtual filesystem. It is a precursor
to some of the later fake-terminal code used in Antistatic.

[Try terminalarg online](https://bluehexagons.github.io/terminalarg/index.htm).

Type `help` in the terminal for a guided list of commands and clickable examples.
The terminal supports command history, tab completion, quoted arguments, paste,
touch keyboards, responsive layouts, file downloads, inline images, and
executable terminal scripts. Everything is in memory and resets on reload.

To run it locally:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000/index.htm>. A local server is required for the
sample downloads used during startup.

The virtual filesystem is temporary. Downloaded JavaScript executes in the page
when you mark it executable and run it, so only execute scripts you trust.
