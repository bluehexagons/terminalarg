#javascript
var terminal = global.terminal;
//contains a list of students and methods to interact with it
function StudentList() {
	this.students = [];
}
StudentList.prototype = {
	//calculates the standard deviation of the scores of students in the provided array
	deviation: function deviation() {
		if (this.students.length === 0) {
			return 0;
		} //else, continue
		var total = 0;
		var average = this.mean(this.students);
		var Square = 2;
		for (var index = 0; index < this.students.length; index++) {
			total += Math.pow(this.students[index].score - average, Square);
		}
		return Math.sqrt(total / (this.students.length - 1));
	},
	
	//averages the scores of the students in the provided array
	mean: function mean() {
		if (this.students.length === 0) {
			return 0;
		} //else, continue
		
		var total = 0;
		for (var index = 0; index < this.students.length; index++) {
			total += this.students[index].score;
		}
		return total / this.students.length;
	},
	
	//calculates variance
	variance: function variance() {
		var Square = 2;
		var variance = Math.pow(this.deviation(), Square);
	},
	
	//sorts the students in the given array, and returns a copy of the array as sorted
	sort: function sort(by) {
		var sortBy;
		var usingStrings;
		//determine which property to sort by
		switch (by) {
			case 'last':
				sortBy = 'lastName';
				usingStrings = true;
				break;
			case 'first':
				sortBy = 'firstName';
				usingStrings = true;
				break;
			case 'middle':
				sortBy = 'middleName';
				usingStrings = true;
				break;
			case 'score':
				sortBy = 'score';
				usingStrings = false;
				break;
			default:
				sortBy = 'lastName';
				usingStrings = true;
				break;
		}
		if (this.students.length > 1 && typeof sortBy !== 'undefined') {
			var bitMask = 1;
			var offset = -1;
			var letsOneBecomeTwoAndZeroStayZero = 2;
			return this.students.sort(function (a, b) {
				// -1 if a is less than b; 0 if they're equal; 1 if a is greater than b
				var leftItem = usingStrings ? a[sortBy].toLowerCase() : a[sortBy];
				var rightItem = usingStrings ? b[sortBy].toLowerCase() : b[sortBy];
				return (leftItem > rightItem & bitMask) * letsOneBecomeTwoAndZeroStayZero + offset + (leftItem === rightItem & bitMask);
			});
		} else {
			//why sort something with one or less elements?
			return false;
		}
	},
	
	//adds a student to the list, returns the student added
	add: function add(student) {
		this.students.push(student);
		return student;
	},
	
	//removes students from the list, returns a list of text describing the removed students
	remove: function remove(firstName, middleName, lastName) {
		var removed = 0;
		var names = [];
		for (var index = 0;index < this.students.length;index++) {
			var student = this.students[index];
			if (student.firstName === firstName && student.lastName === lastName && student.middleName === middleName) {
				names.push('removed: ' + this.students.splice(index - removed,1));
				removed++;
				index--; //take a step back since we just removed an item
			} //else, this student is not a culprit for removal
		}
		return names;
	},
	
	//returns a list of students if there are any
	list: function list() {
		if (this.students.length > 0) {
			return this.students;
		} else {
			return 'no students to list';
		}
	},
	
	//returns student details
	details: function details() {
		list = [];
		for (var index = 0; index < this.students.length; index++) {
			var student = this.students[index];
			list.push('first: ' + student.firstName + (student.middleName ? '; middle: ' + student.middleName : '') + '; last: ' + student.lastName + '; score: ' + student.score);
		}
		return ['student details:', list];
	}
}

var GradeLetters = {
	conversions: [
		{grade: 0, letter: 'F'},
		{grade: 60, letter: 'D'},
		{grade: 70, letter: 'C'},
		{grade: 80, letter: 'B'},
		{grade: 90, letter: 'A'}
	],
	checkGrade: function (score) {
		var letter = this.conversions[0].letter;
		for (var i = 1;i < this.conversions.length;i++) {
			if (score < this.conversions[i].grade) {
				return letter;
			}
			else {
				letter = this.conversions[i].letter;
			}
		}
		return letter;
	}
}

//creates a method that returns a specified property, particularly useful for simple toString methods
var simpleToString = function (propertyName) {
	return (function () {
		return this[propertyName];
	});
}

// parseString(pattern, input, validation)
// pattern is similar to regex (and is expanded to regex in code).
// input is the input string to match
// returns false if it is not matched
// %% -- insert a % character
// %* -- insert a * character
// %_ -- variable whitespace (but required)
// %  -- that's a % followed by a space; optional whitespace
// %w -- capture an alphanumeric word
// %W -- optional word
// %n -- capture a number (floating-point compatible, but will cut off if there are multiple decimal points while still eating them)
// %N -- optional number
// %s -- capture a string (greedy)
// *w -- capture multiple words; returned as array
// *n -- capture multiple digits; returned as array
//
// validation holds an object or array
// each of its properties should correspond to a captured element
// and hold a function to call for validation; the only argument will be the value
// should return true if valid, false otherwise
// non-function values in validation will be skipped (always true)
var irrex = ( function () {
	//pattern object constructor
	var patternToString = simpleToString('letter');
	function Pattern(letter, capture, regularExpression, multipleExpression, numeric) {
		this.letter = letter;
		this.capture = capture;
		this.rx = regularExpression;
		this.mrx = multipleExpression;
		this.toString = patternToString;
		this.numeric = !!numeric; //converts to boolean, for clearer function calls
	}
	
	var patterns = {
		underscore: new Pattern('_', false, '\\s+'),
		escape: new Pattern('%', false, '%'),
		multiple: new Pattern('*', false, '*'),
		paren: new Pattern('(', false, '\\('),
		end: new Pattern(')', false, '\\)'),
		space: new Pattern(' ', false, '[\\s+]?'),
		word: new Pattern('w', true, '(\\S+)', '(.*)'),
		optWord: new Pattern('W', true, '(\\S+)?'),
		string: new Pattern('s', true, '(.*)'),
		optString: new Pattern('S', true, '(.*)?'),
		number: new Pattern('n', true, '(-?[\\d|\\.]+)', '(-?[\\d|\\.|\\s]*)', 'number'),
		optNumber: new Pattern('N', true, '(-?[\\d|\\.]+)?', undefined, 'number')
	}
	
	return (function (pattern, input, validation) {
		var regex = '^';
		var escaped = false;
		var multiple = false;
		var needSubmit = 0;
		var naming = false;
		if (typeof validation !== 'object') {
			validation = {};
		} //else, we don't need to ensure that validation is an object
		var items = []; //this will store locations/names of data.
		items.items = 0;
		
		//builds the regular expression and records data about the parts
		for (var index = 0; index < pattern.length; index++) {
			var letter = pattern.charAt(index);
			var modEven = 2;
			if (escaped) {
				for (var type in patterns) {
					if (patterns.hasOwnProperty(type)) {
						if (patterns[type] == letter) {
							regex += patterns[type].rx;
							if (patterns[type].capture) {
								needSubmit = 1 + ((patterns[type].numeric & 1) * 2);
							} //else, this one shouldn't be captured
							break; //we can break out of the loop once we've found the right pattern
						} //else, keep searching
					} //else, this is somehow a property that we don't care about
				}
				escaped = false;
			} else if (multiple) {
				for (var type in patterns) {
					if (patterns.hasOwnProperty(type)) {
						if (patterns[type] == letter) {
							regex += patterns[type].mrx;
							if (patterns[type].capture) {
								needSubmit = 2 + ((patterns[type].numeric & 1) * 2);
							} //else, this one shouldn't be captured
							break; //we can break out of the loop once we've found the right pattern
						} //else, keep searching
					} //else, this is somehow a property that we don't care about
				}
				multiple = false;
			} else if (naming !== false) {
				if ((naming.length === 0) && (letter == patterns.underscore)) {
					throw Error("Underscores not allowed at the start of a name. Ignoring.");
				} else {
					if (letter == patterns.end) {
						var numericCutoff = 2;
						items.push({name: naming, index: items.length, multiple: !(needSubmit % modEven), numeric: (needSubmit > numericCutoff)});
						needSubmit = 0;
						naming = false;
					} else {
						naming += letter;
					}
				}
			} else {
				if (letter == patterns.escape) {
					escaped = true;
				} else if (letter == patterns.multiple) {
					multiple = true;
				} else if (needSubmit && (letter == patterns.paren)) {
					naming = '';
				} else if ((!needSubmit && letter == patterns.paren) || (letter == patterns.end)) {
					regex += '\\' + letter;
				} else {
					regex += letter;
				}
				if (needSubmit && naming === false) {
					var numericCutoff = 2;
					items.push({name: items.items, index: items.length, multiple: !(needSubmit % modEven), numeric: (needSubmit > numericCutoff)});
					items.items++;
					needSubmit = 0;
				} //else, we don't need to submit the last pattern
			}
		}
		if (needSubmit) {
			var numericCutoff = 2;
			items.push({name: items.items, index: items.length, multiple: !(needSubmit % modEven), numeric: (needSubmit > numericCutoff)});
			items.items++;
			needSubmit = 0;
		} //else, we don't need to submit the last pattern
		regex += '$';
		
		//now to execute the regular expression
		var regexp = RegExp(regex);
		var res = regexp.exec(input);
		//and turn the raw data into the desired output
		if (res instanceof Array) {
			res.splice(0,1); //remove the actual matched text, since it will always be the full line
			var holdster = {length: 0};
			
			if (typeof Object.defineProperty !== 'undefined') {
				Object.defineProperty(holdster, "length", {enumerable: false});
			} //don't try to define the property to be non-enumerable if the function isn't supported by the browser
			for (var index = 0; index < items.length; index++) {
				var item = items[index];
				var value = res[item.index];
				
				if (item.multiple && (typeof value !== 'undefined')) {
					value = value.replace(/\s+/g,' ').split(' ');
				} else {
					value = [value];
				}
				for (var subindex = 0; subindex < value.length; subindex++) {
					var subvalue = value[subindex];
					if (item.numeric) {
						if (typeof subvalue === 'undefined') {
							value[subindex] = subvalue;
						} else if (isNaN(+subvalue)) {
							return false; //in case it caught an invalid number in the regex
						} else {
							value[subindex] = +subvalue;
						}
					} else {
						value[subindex] = subvalue;
					}
					if (validation.hasOwnProperty(item.name) && validation[item.name] instanceof Function) {
						if (!validation[item.name](subvalue)) {
							return false;
						} //else, the number is valid
					} //else, this item doesn't need to be tested
				}
				
				if (value.length === 1) {
					holdster[item.name] = value[0];
				} else {
					holdster[item.name] = value;
				}
				if (!isNaN(+item.name)) {
					holdster.length = Math.max(holdster.length, +item.name + 1);
				} //else, don't change the length since it's only concerned with numeric properties
			}
			return holdster;
		} else {
			return false;
		}
	});
} )();

//console.log(irrex('(%w(area))% %w(prefix)-%w(digits)','(123) 456-7890'));

var students = new StudentList();
var maxScore = 100;
var minScore = 0;
var lastEntry = '';
var lastValue = '';
var historyIndex = 0;
var historyLength = 32;
var history = [];
function addHistory(item) {
	if (history.unshift(item) > historyLength) {
		history.pop();
	} //else, don't pop
}
var reset = true; //reset on backspace

//defines an instance of a Student
function Student(firstName, middleName, lastName, score) {
	this.firstName = firstName;
	this.lastName = lastName;
	this.middleName = middleName;
	this.score = score;
}
//extracts the student's information and returns it as a formatted string
Student.prototype.toString = function () {
	return this.lastName + ', ' + this.firstName + (this.middleName ? ' ' + this.middleName : '') + ': ' + this.score + '/' + GradeLetters.checkGrade(this.score);
}

//prints any object that can be converted to a string, or an array of such objects, to the "console"; can also accept an array with arrays in it, or arrays with arrays and text.
function printConsole(text, stretch) {
	if (text instanceof Array) {
		for (var index = 0;index < text.length;index++) {
			printConsole(text[index], text.length + ((stretch - 1) | 0));
		}
		
	} else if (typeof text !== 'undefined' && typeof text.toString !== 'undefined') {
		terminal.echo(text.toString());
	}
}

//clears the console
function clearConsole() {
	while (consoleDiv.childNodes.length > 0) {
		consoleDiv.removeChild(consoleDiv.firstChild);
	}
}

//prints the statistics of the current student list
function printStats() {
	if (students.students.length > 0) {
		var Square = 2;
		var average = students.mean();
		var stdDev = students.deviation();
		var variance = Math.pow(stdDev, Square);
		var precision = 4;
		printConsole(['Score statistics:',
			'average: ' + average.toFixed(precision),
			'standard deviation: ' + stdDev.toFixed(precision),
			'variance: ' + variance.toFixed(precision)]);
	} else {
		printConsole('no students');
	}
}

var EnterKey = 13,
	UpKey = 38,
	DownKey = 40,
	backspaceKey = 8,
	tabKey = 9;

//event function should be given to the text area
function takeInput(value) {
	var command = value.split(' ')[0];
	var text = value.substring(command.length + 1);

	var add = false,
		remove = false,
		list = false,
		sort = false,
		help = false,
		calc = false,
		clear = false,
		inspect = false,
		exit = false;
	
	//parses the command and runs code that isn't executed when the enter key is pressed
	switch (command) {
		case 'add':
			add = true;
			break;
		case 'remove':
			remove = true;
			break;
		case 'list':
			list = true;
			break;
		case 'sort':
			sort = true;
			break;
		case 'herp': //falls through
		case 'help':
			help = true;
			break;
		case 'stats': //falls through
		case 'calc':
			calc = true;
			break;
		case 'clear':
			clear = true;
			break;
		case 'details': //falls through
		case 'inspect':
			inspect = true;
			break;
		case 'quit':
		case 'q':
		case 'exit':
			exit = true;
		default:
			break;
	}
	
	//runs code based on the command entered
	if (help) { //show some help
		printConsole(['command list:',
			'help -- display this help',
			'add [last name], [first name] {middle name}: [score] -- add a student; {middle name} is optional',
			'remove [last name], [first name] -- remove named student',
			'list -- lists all students and scores',
			'sort {last/first/score} -- sorts students; default is last',
			'stats -- calculate average, standard deviation, and variance',
			'clear -- clears students',
			'inspect -- shows all student details',
			'quit -- exit the application',
			'----']);
			
	} else if (add) { //adding a new student
		var validateScore = function (score) {
			return (score >= minScore && score <= maxScore);
		};
		var parsed = irrex('%s(last),% %w(first)% %S(middle):% %n(score)', text, {score: validateScore}); //proper format
		if (!parsed) {
			parsed = irrex('%w(first)%_%w(middle)%_%w(last)%_%n(score)', text, {score: validateScore}); //try a lazy format
		} //else, continue on
		if (!parsed) {
			parsed = irrex('%w(first)%_%w(last)%_%n(score)', text, {score: validateScore}); //maybe no middle name?
		} //else, continue on
		if (parsed) {
			var student = new Student(parsed.first, parsed.middle, parsed.last, parsed.score);
			printConsole('added ' + students.add(student));
		} else {
			printConsole(['error in parsing entry.',
				'format: add [last name], [first name] {middle name}: [score (0-100)]']);
		}
		
	} else if (remove) { //removing a student
		var parsed = irrex('%s(last),% %w(first)% %S(middle)', text);
		if (!parsed) {
			parsed = irrex('%w(first)% %W(middle)%_%w(last)', text); //try a slightly lazier format
		} //else, continue on
		if (parsed) {
			var lastName = parsed.last;
			var firstName = parsed.first;
			var middleName = parsed.middle;
			printConsole(students.remove(firstName, middleName, lastName));
			
		} else {
			printConsole(['error in parsing entry.',
				'format: remove [last name], [first name]']);
		}
		
	} else if (list) { //lists students
		printConsole(['listing students: ',students.list()]);
		
	} else if (sort) { //sorts students
		var sorted = students.sort(text);
		if (sorted !== false) {
			students.students = sorted;
			printConsole(['sorted students by ' + (text ? text : 'last') + ':',
				students.students]);
				
		} else {
			printConsole(['error in parsing entry.',
				'format: sort {last/first/score}']);
		}
	} else if (calc) { //calculates stats
		printStats();
		
	} else if (clear) { //clears student list
		printConsole(['clearing students:',
			students.students.splice(0)]);
			
	} else if (inspect) { //inspects students (to show for sure that nothing is faked)
		printConsole(students.details());
	} else if (this.value === '') { //prints a separator
		printConsole('---');
		
	} else if (exit) {
		//save or something?
	} else {
		printConsole('unknown command: "' + command + '". try "help".');
	}
	//reset = true;
	if (!exit) {
		terminal.getInput(takeInput);
	}
}
takeInput('help');