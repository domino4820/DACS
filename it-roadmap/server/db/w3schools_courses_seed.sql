-- W3Schools-like Course Data for IT Roadmap Application
-- This file contains SQL INSERT statements to populate courses with educational content

-- HTML Courses
INSERT INTO "courses" ("title", "code", "description", "url", "content", "category_id", "skill_id", "created_at", "updated_at")
VALUES
-- HTML basics (assuming category_id 1 is 'HTML and CSS' and skill_id 1 is 'HTML')
('Introduction to HTML', 'HTML-INTRO-001', 'Learn the basics of HTML, the standard markup language for Web pages.', 'https://example.com/courses/html-intro', 
'# Introduction to HTML

HTML is the standard markup language for creating Web pages.

## What is HTML?
- HTML stands for Hyper Text Markup Language
- HTML is the standard markup language for Web pages
- HTML elements are the building blocks of HTML pages
- HTML elements are represented by tags
- Browsers do not display the HTML tags, but use them to render the content of the page

## A Simple HTML Document
```html
<!DOCTYPE html>
<html>
<head>
<title>Page Title</title>
</head>
<body>

<h1>My First Heading</h1>
<p>My first paragraph.</p>

</body>
</html>
```

## HTML Tags
HTML tags are element names surrounded by angle brackets:
- `<tagname>content</tagname>`
- HTML tags normally come in pairs like `<p>` and `</p>`
- The first tag in a pair is the start tag, the second tag is the end tag
- The end tag is written like the start tag, but with a forward slash inserted before the tag name

## Web Browsers
The purpose of a web browser (Chrome, Edge, Firefox, Safari) is to read HTML documents and display them correctly.

A browser does not display the HTML tags, but uses them to determine how to display the document.
', 1, 1, NOW(), NOW()),

('HTML Elements', 'HTML-ELEM-002', 'Learn about HTML elements and how to use them effectively in web pages.', 'https://example.com/courses/html-elements', 
'# HTML Elements

An HTML element is defined by a start tag, some content, and an end tag.

## HTML Element Syntax
- `<tagname>Content goes here...</tagname>`
- The HTML element is everything from the start tag to the end tag
- Some HTML elements have no content (like the `<br>` element)
- Empty elements are closed in the start tag
- Most HTML elements can have attributes

## Nested HTML Elements
HTML elements can be nested (elements can contain elements).
All HTML documents consist of nested HTML elements.

Example:
```html
<!DOCTYPE html>
<html>
<body>

<h1>My First Heading</h1>
<p>My first paragraph.</p>

</body>
</html>
```

## Common HTML Elements
- `<h1>` to `<h6>`: Headings
- `<p>`: Paragraph
- `<a>`: Link
- `<img>`: Image
- `<ul>`, `<ol>`, `<li>`: Lists
- `<div>`: Division
- `<span>`: Inline container
- `<table>`: Table
- `<form>`: Form

## HTML Document Structure
A basic HTML document structure includes:
- Document type declaration: `<!DOCTYPE html>`
- HTML root element: `<html>`
- Head section: `<head>` (metadata)
- Body section: `<body>` (visible content)
', 1, 1, NOW(), NOW()),

-- CSS courses
('CSS Fundamentals', 'CSS-FUND-001', 'Learn the fundamentals of CSS for styling web pages.', 'https://example.com/courses/css-fundamentals', 
'# CSS Fundamentals

CSS (Cascading Style Sheets) is used to style and layout web pages.

## What is CSS?
- CSS stands for Cascading Style Sheets
- CSS describes how HTML elements are to be displayed on screen, paper, or in other media
- CSS saves a lot of work by controlling the layout of multiple web pages all at once
- External stylesheets are stored in CSS files

## CSS Syntax
A CSS rule consists of a selector and a declaration block:
```css
selector {
  property: value;
  property: value;
}
```

- The selector points to the HTML element to style
- The declaration block contains one or more declarations separated by semicolons
- Each declaration includes a CSS property name and a value, separated by a colon

## Ways to Insert CSS
There are three ways to insert CSS:
1. External CSS - using a separate CSS file
2. Internal CSS - using a `<style>` element in the `<head>` section
3. Inline CSS - using a style attribute in an HTML element

## CSS Selectors
CSS selectors are used to "find" (or select) the HTML elements you want to style.

Common selectors:
- Element selectors (tag names)
- ID selectors (#id)
- Class selectors (.class)
- Universal selector (*)
- Grouping selectors (separating with commas)
', 1, 2, NOW(), NOW()),

('CSS Box Model', 'CSS-BOX-002', 'Learn about the CSS box model and how to use it for layout.', 'https://example.com/courses/css-box-model', 
'# CSS Box Model

All HTML elements can be considered as boxes. The CSS box model represents how these rectangular boxes are rendered.

## Box Model Components
The CSS box model is essentially a box that wraps around every HTML element. It consists of:
- Content - The content of the box, where text and images appear
- Padding - Clears an area around the content (transparent)
- Border - A border that goes around the padding and content
- Margin - Clears an area outside the border (transparent)

## Box Model Properties
```css
div {
  width: 300px;
  padding: 10px;
  border: 5px solid gray;
  margin: 20px;
}
```

## Total Element Width and Height
When you set the width and height properties, you are setting just the content area.
To calculate the full size of an element, you must add padding, borders, and margins:

Total element width = width + left padding + right padding + left border + right border + left margin + right margin
Total element height = height + top padding + bottom padding + top border + bottom border + top margin + bottom margin

## The box-sizing Property
The `box-sizing` property allows us to include the padding and border in an element\'s total width and height.

```css
.box {
  box-sizing: border-box;
}
```

With `box-sizing: border-box;`, the padding and border are included in the width and height.
', 1, 2, NOW(), NOW()),

-- JavaScript courses
('JavaScript Basics', 'JS-BASICS-001', 'Learn the basics of JavaScript programming.', 'https://example.com/courses/js-basics', 
'# JavaScript Basics

JavaScript is the programming language of the Web. It makes web pages dynamic and interactive.

## What is JavaScript?
- JavaScript is a lightweight, interpreted programming language
- JavaScript is designed for creating network-centric applications
- JavaScript is complementary to and integrated with HTML
- JavaScript is easy to learn

## JavaScript Variables
In JavaScript, variables are used to store data values.

```javascript
var x = 5;       // Using var
let y = 6;       // Using let
const z = 7;     // Using const
```

- `var`: Declares a variable, optionally initializing it to a value (function scoped)
- `let`: Declares a block-scoped, local variable (ES6)
- `const`: Declares a block-scoped, read-only constant (ES6)

## JavaScript Data Types
JavaScript variables can hold many data types:

- Numbers: `let length = 16;`
- Strings: `let color = "Blue";`
- Booleans: `let isActive = true;`
- Arrays: `let cars = ["Saab", "Volvo", "BMW"];`
- Objects: `let person = {firstName:"John", lastName:"Doe", age:50};`
- Undefined: `let car;` (value is undefined)
- Null: `let emptyValue = null;`

## JavaScript Functions
A JavaScript function is defined with the `function` keyword, followed by a name, followed by parentheses ().

```javascript
function myFunction(p1, p2) {
  return p1 * p2;   // The function returns the product of p1 and p2
}

// Arrow function (ES6)
const myArrowFunc = (p1, p2) => p1 * p2;
```

## JavaScript Events
HTML events are "things" that happen to HTML elements, which JavaScript can react to.

Common events:
- `onclick`: When user clicks on an element
- `onload`: When a page or image has finished loading
- `onchange`: When the content of a form element changes
- `onmouseover`: When the mouse pointer moves over an element
- `onmouseout`: When the mouse pointer moves away from an element
', 2, 12, NOW(), NOW()),

-- Python courses
('Python for Beginners', 'PY-BEG-001', 'Learn the basics of Python programming for beginners.', 'https://example.com/courses/python-beginners', 
'# Python for Beginners

Python is a popular programming language. It was created by Guido van Rossum, and released in 1991.

## What is Python?
Python is an:
- Interpreted language
- High-level programming language
- Object-oriented programming language
- Open source language

## Getting Started with Python
The basic syntax for a Python program is quite simple:

```python
# This is a comment
print("Hello, World!")
```

## Python Variables
Python variables do not need explicit declaration to reserve memory space. The declaration happens automatically when you assign a value to a variable.

```python
x = 5
y = "Hello, World!"
```

## Python Data Types
Python has the following built-in data types:

- Text Type: `str`
- Numeric Types: `int`, `float`, `complex`
- Sequence Types: `list`, `tuple`, `range`
- Mapping Type: `dict`
- Set Types: `set`, `frozenset`
- Boolean Type: `bool`
- Binary Types: `bytes`, `bytearray`, `memoryview`

## Python Control Structures

### Conditionals
```python
if condition:
    # code
elif another_condition:
    # code
else:
    # code
```

### Loops
```python
# For loop
for x in range(6):
    print(x)
    
# While loop
i = 1
while i < 6:
    print(i)
    i += 1
```

## Python Functions
A function is a block of code which only runs when it is called.

```python
def my_function():
    print("Hello from a function")

my_function()  # call the function
```

## Python Lists
Lists are used to store multiple items in a single variable.

```python
my_list = ["apple", "banana", "cherry"]
print(my_list[0])  # Output: apple
```

Lists are:
- Ordered
- Changeable
- Allow duplicate values
', 3, 20, NOW(), NOW()),

-- SQL courses
('SQL Fundamentals', 'SQL-FUND-001', 'Learn the fundamentals of SQL for database management.', 'https://example.com/courses/sql-fundamentals', 
'# SQL Fundamentals

SQL (Structured Query Language) is a standard language for accessing and manipulating databases.

## What is SQL?
SQL is:
- Used to communicate with a database
- The standard language for relational database management systems
- Used to perform tasks such as update data or retrieve data from a database

## Basic SQL Commands
- `SELECT` - extracts data from a database
- `UPDATE` - updates data in a database
- `DELETE` - deletes data from a database
- `INSERT INTO` - inserts new data into a database
- `CREATE DATABASE` - creates a new database
- `ALTER DATABASE` - modifies a database
- `CREATE TABLE` - creates a new table
- `ALTER TABLE` - modifies a table
- `DROP TABLE` - deletes a table

## SQL SELECT Statement
The `SELECT` statement is used to select data from a database.

```sql
SELECT column1, column2, ...
FROM table_name;
```

To select all columns:

```sql
SELECT * FROM table_name;
```

## SQL WHERE Clause
The `WHERE` clause is used to filter records.

```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```

Example:
```sql
SELECT * FROM Customers
WHERE Country=\'Germany\';
```

## SQL ORDER BY Keyword
The `ORDER BY` keyword is used to sort the result-set in ascending or descending order.

```sql
SELECT column1, column2, ...
FROM table_name
ORDER BY column1, column2, ... ASC|DESC;
```

## SQL INSERT INTO Statement
The `INSERT INTO` statement is used to insert new records in a table.

```sql
INSERT INTO table_name (column1, column2, column3, ...)
VALUES (value1, value2, value3, ...);
```

## SQL UPDATE Statement
The `UPDATE` statement is used to modify the existing records in a table.

```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
```

## SQL DELETE Statement
The `DELETE` statement is used to delete existing records in a table.

```sql
DELETE FROM table_name WHERE condition;
```
', 3, 21, NOW(), NOW()),

-- Machine Learning courses
('Introduction to Machine Learning', 'ML-INTRO-001', 'Learn the basics of machine learning concepts and applications.', 'https://example.com/courses/ml-intro', 
'# Introduction to Machine Learning

Machine learning is a branch of artificial intelligence that focuses on building systems that learn from data.

## What is Machine Learning?
Machine learning is a method of data analysis that automates analytical model building. It is a branch of artificial intelligence based on the idea that systems can learn from data, identify patterns, and make decisions with minimal human intervention.

## Types of Machine Learning
There are three main types of machine learning:

1. **Supervised Learning**
   - Works with labeled data
   - Predicts outcomes for new data
   - Examples: classification, regression

2. **Unsupervised Learning**
   - Works with unlabeled data
   - Finds patterns or structures in data
   - Examples: clustering, association, dimensionality reduction

3. **Reinforcement Learning**
   - An agent learns to behave in an environment
   - Learns by receiving rewards or penalties
   - Examples: game playing, robotics

## Key Machine Learning Algorithms

### Supervised Learning Algorithms
- Linear Regression
- Logistic Regression
- Decision Trees
- Random Forest
- Support Vector Machines (SVM)
- K-Nearest Neighbors (KNN)
- Neural Networks

### Unsupervised Learning Algorithms
- K-means Clustering
- Hierarchical Clustering
- Principal Component Analysis (PCA)
- Independent Component Analysis (ICA)
- Association Rules

## Machine Learning Workflow
1. **Data Collection**: Gather relevant data for your problem
2. **Data Preprocessing**: Clean, transform, and prepare data
3. **Feature Engineering**: Select or create relevant features
4. **Model Selection**: Choose appropriate algorithm(s)
5. **Training**: Build model using training data
6. **Evaluation**: Assess model performance using metrics
7. **Hyperparameter Tuning**: Optimize model parameters
8. **Deployment**: Implement model in production

## Applications of Machine Learning
- Image and speech recognition
- Medical diagnosis
- Predictive maintenance
- Financial forecasting
- Recommendation systems
- Natural language processing
- Self-driving vehicles
- Fraud detection
', 4, 35, NOW(), NOW());

-- Example of documents for a course (linked to the HTML intro course with id 1)
INSERT INTO "documents" ("title", "url", "description", "course_id", "created_at", "updated_at")
VALUES
('HTML Elements Reference', 'https://example.com/docs/html-elements-ref', 'A comprehensive reference for HTML elements', 1, NOW(), NOW()),
('HTML Attributes Guide', 'https://example.com/docs/html-attributes', 'Complete guide to HTML attributes', 1, NOW(), NOW()),
('HTML Best Practices', 'https://example.com/docs/html-best-practices', 'Best practices for writing clean HTML code', 1, NOW(), NOW()); 