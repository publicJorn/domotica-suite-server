# DomoticaSuite - server

Receives and stores sensor data and provides an api for monitoring this data.

## Internals

### Y no Yarn?

Yarn does amazing deep dependency checking. This is great.
However, there seems to be an error with a deep dependency of Nedb; A version mismatch of `esprima-fb`.<br>
I couldn't find a fix or workaround and decided to move back to **npm** for now, because it works.
