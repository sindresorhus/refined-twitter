import test from 'ava';
import Window from './fixtures/window';

global.window = new Window();
global.location = window.location;
global.document = {};

test.todo('main');
