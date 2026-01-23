import firebase_admin
from firebase_admin import credentials, firestore
from firebase_config import firebase_client

db = firebase_client.db

# Data from src/data/questions.ts converted to Python
QUESTIONS = {
  "AI / ML": {
    "easy": [
      { "q": "What is AI?", "options": ["Simulation of human intelligence", "Database", "OS", "Compiler"], "correct": 0, "exp": "AI simulates human intelligence in machines." },
      { "q": "What is ML?", "options": ["Learning from data", "Hard coding", "Manual rules", "Networking"], "correct": 0, "exp": "ML learns patterns from data." },
      { "q": "Supervised learning uses?", "options": ["Labeled data", "Unlabeled data", "Random data", "No data"], "correct": 0, "exp": "Supervised learning needs labeled data." },
      { "q": "What is a dataset?", "options": ["Collection of data", "Algorithm", "Model", "Feature"], "correct": 0, "exp": "Dataset is a collection of data." },
      { "q": "What is overfitting?", "options": ["Memorizing training data", "Good generalization", "Underfitting", "Noise"], "correct": 0, "exp": "Overfitting fails on new data." },
      { "q": "What is Clustering?", "options": ["Grouping similar data", "Sorting data", "Deleting data", "Labeling data"], "correct": 0, "exp": "Unsupervised learning technique." },
      { "q": "What is a Neural Network?", "options": ["Inspired by human brain", "A computer network", "A web server", "A database"], "correct": 0, "exp": "Layers of nodes mimicking neurons." },
      { "q": "What is NLP?", "options": ["Natural Language Processing", "New Learning Protocol", "Network Loop Process", "Node Link Path"], "correct": 0, "exp": "Interaction between computers and human language." },
      { "q": "Which is a Python library for ML?", "options": ["Scikit-learn", "React", "Django", "Flask"], "correct": 0, "exp": "Popular ML library." },
      { "q": "What is Computer Vision?", "options": ["Processing visual data", "Designing screens", "Network monitoring", "Sound analysis"], "correct": 0, "exp": "Helping computers 'see' images/video." }
    ],
    "medium": [
      { "q": "What is Bias?", "options": ["Simplifying assumptions", "Variance", "Noise", "Outliers"], "correct": 0, "exp": "High bias causes underfitting." },
      { "q": "What is Variance?", "options": ["Sensitivity to fluctuations", "Bias", "Error", "Accuracy"], "correct": 0, "exp": "High variance causes overfitting." },
      { "q": "Gradient Descent is?", "options": ["Optimization algorithm", "Loss function", "Metric", "Model"], "correct": 0, "exp": "It minimizes the cost function." },
      { "q": "What is One-Hot Encoding?", "options": ["Categorical to binary", "Binary to text", "Image processing", "Data cleaning"], "correct": 0, "exp": "Converts categories into binary vectors." },
      { "q": "What is a Confusion Matrix?", "options": ["Performance measurement", "Error type", "Data structure", "Algorithm"], "correct": 0, "exp": "Table used to evaluate classification models." },
      { "q": "What is Cross-Validation?", "options": ["Evaluating model performance", "Crossing data", "Validating passwords", "Mixing datasets"], "correct": 0, "exp": "Assesses how results generalize." },
      { "q": "What is Feature Scaling?", "options": ["Normalizing range of features", "Increasing data size", "Deleting features", "Selecting features"], "correct": 0, "exp": "Important for distance-based algorithms." },
      { "q": "What is K-Means?", "options": ["Clustering algorithm", "Classification algorithm", "Regression", "Supervised learning"], "correct": 0, "exp": "Partitioning n observations into k clusters." },
      { "q": "What is Dimensionality Reduction?", "options": ["Reducing random variables", "Deleting rows", "Compressing files", "Reducing code"], "correct": 0, "exp": "PCA is a common technique." },
      { "q": "What is Reinforcement Learning?", "options": ["Learning via rewards/penalties", "Labeling data", "Clustering", "Regression"], "correct": 0, "exp": "Agent acts in an environment." }
    ],
    "hard": [
      { "q": "What is Backpropagation?", "options": ["Updating weights based on error", "Forward pass", "Initialization", "Activation"], "correct": 0, "exp": "Core algorithm for training neural networks." },
      { "q": "Vanishing Gradient problem affects?", "options": ["Deep networks (RNNs)", "Linear regression", "K-Means", "Random Forest"], "correct": 0, "exp": "Gradients become too small to update weights." },
      { "q": "What is Drop-out?", "options": ["Regularization technique", "Optimization", "Loss function", "Activation"], "correct": 0, "exp": "Randomly ignores neurons to prevent overfitting." },
      { "q": "BERT is based on?", "options": ["Transformers", "RNN", "CNN", "LSTM"], "correct": 0, "exp": "BERT uses the Transformer architecture." },
      { "q": "What is GAN?", "options": ["Generative Adversarial Network", "Graph Area Network", "Global AI Node", "General Auto Norm"], "correct": 0, "exp": "Two networks competing to generate new data." },
      { "q": "What is an Activation Function?", "options": ["Introduces non-linearity", "Starts the training", "Calculates error", "Loads data"], "correct": 0, "exp": "e.g., ReLU, Sigmoid, Tanh." },
      { "q": "What is Transfer Learning?", "options": ["Using pre-trained models", "Moving data", "Copying code", "Parallel processing"], "correct": 0, "exp": "Applying knowledge from one task to another." },
      { "q": "What is LSTM?", "options": ["Long Short-Term Memory", "Linear System Time Model", "Large Scale Text Mode", "Low Storage Text Method"], "correct": 0, "exp": "RNN architecture for sequence data." },
      { "q": "What is XGBoost?", "options": ["Gradient boosting library", "Neural network", "Database", "Hosting service"], "correct": 0, "exp": "Efficient implementation of gradient boosting." },
      { "q": "What is the Curse of Dimensionality?", "options": ["Data sparsity in high dimensions", "Bad luck", "Slow computer", "Too much storage"], "correct": 0, "exp": "Volume increases exponentially adding dimensions." }
    ],
  },
  "Web Development": {
    "easy": [
      { "q": "HTML stands for?", "options": ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tool ML", "None"], "correct": 0, "exp": "Standard markup language for web." },
      { "q": "CSS is used for?", "options": ["Styling", "Logic", "Database", "Server"], "correct": 0, "exp": "Cascading Style Sheets control layout." },
      { "q": "What is the DOM?", "options": ["Document Object Model", "Data Object Mode", "Disk OS Mode", "Digital Ordinance Model"], "correct": 0, "exp": "DOM represents the page structure." },
      { "q": "Which tag creates a link?", "options": ["<a>", "<link>", "<href>", "<url>"], "correct": 0, "exp": "The anchor tag <a> defines hyperlinks." },
      { "q": "What is HTTP?", "options": ["Protocol for fetching resources", "Programming Language", "Database", "Browser"], "correct": 0, "exp": "HyperText Transfer Protocol." },
      { "q": "Heading tag with largest text?", "options": ["<h1>", "<h6>", "<head>", "<header>"], "correct": 0, "exp": "h1 is the most important heading." },
      { "q": "Unordered list tag?", "options": ["<ul>", "<ol>", "<li>", "<dl>"], "correct": 0, "exp": "Creates bulleted lists." },
      { "q": "Standard Image format?", "options": ["JPG/PNG", "EXE", "TXT", "MP3"], "correct": 0, "exp": "Common web image formats." },
      { "q": "JavaScript is?", "options": ["Scripting Language", "Compiled Language", "Database", "OS"], "correct": 0, "exp": "Runs in the browser." },
      { "q": "CSS Box Model components?", "options": ["Content, Padding, Border, Margin", "Header, Footer, Main", "Div, Span", "None"], "correct": 0, "exp": "Layout structure." },
      { "q": "What is an IP address?", "options": ["Device ID on network", "Password", "Email", "URL"], "correct": 0, "exp": "Internet Protocol address." },
      { "q": "HTML attribute for image source?", "options": ["src", "href", "link", "alt"], "correct": 0, "exp": "Specifies path to image." },
      { "q": "What is responsive design?", "options": ["Adapts to screen size", "Fast loading", "Secure", "Database"], "correct": 0, "exp": "Mobile-friendly layout." },
      { "q": "Bootstrap is?", "options": ["CSS Framework", "JS Library", "Database", "OS"], "correct": 0, "exp": "Popular UI library." },
      { "q": "URL stands for?", "options": ["Uniform Resource Locator", "Universal Reference Link", "Unified Real Link", "None"], "correct": 0, "exp": "Web address." },
    ],
    "medium": [
      { "q": "What is the Virtual DOM?", "options": ["Lightweight copy of DOM", "A VR tool", "Browser engine", "Server file"], "correct": 0, "exp": "React uses it for performance." },
      { "q": "What is a Closure?", "options": ["Function with lexical environment", "Closing a tag", "Ending a loop", "Error type"], "correct": 0, "exp": "Function remembering variables from outer scope." },
      { "q": "Difference: == vs ===?", "options": ["Value vs Value & Type", "No difference", "Assignment vs Compare", "Speed"], "correct": 0, "exp": "=== checks types as well." },
      { "q": "What is 'this' in JS?", "options": ["Reference to object", "A variable", "A function", "Global scope"], "correct": 0, "exp": "Refers to the object executing the code." },
      { "q": "What is Flexbox?", "options": ["One-dimensional layout method", "Animation tool", "Database", "Testing tool"], "correct": 0, "exp": "CSS module for flexible layouts." },
      { "q": "Grid vs Flexbox?", "options": ["2D vs 1D layout", "Same", "Grid is older", "Flex is faster"], "correct": 0, "exp": "Grid handles rows & cols." },
      { "q": "JSON methods?", "options": ["parse() & stringify()", "toObject()", "convert()", "None"], "correct": 0, "exp": "Converting between string and object." },
      { "q": "LocalStorage vs sessionStorage?", "options": ["Persistent vs Session-only", "Same", "Server vs Client", "None"], "correct": 0, "exp": "Expiry difference." },
      { "q": "What is a Callback?", "options": ["Function passed as arg", "Phone call", "Return value", "Loop"], "correct": 0, "exp": "Executed after task completion." },
      { "q": "Async/Await is?", "options": ["Sugar for Promises", "New language", "Faster", "Synchronous"], "correct": 0, "exp": "Cleaner async code." },
      { "q": "Event Loop?", "options": ["Handles async ops", "A for loop", "A while loop", "Error"], "correct": 0, "exp": "Manages execution context." },
      { "q": "Spread operator?", "options": ["...", ">>>", "&&", "||"], "correct": 0, "exp": "Expands arrays/objects." },
      { "q": "Destructuring?", "options": ["Unpacking values", "Destroying data", "Deleting", "Sorting"], "correct": 0, "exp": "Extracts values from arrays/objects." },
      { "q": "CSS pseudo-class?", "options": [":hover", ".class", "#id", "<div>"], "correct": 0, "exp": "State of an element." },
      { "q": "Media Query?", "options": ["Responsive CSS rule", "Video player", "Audio setting", "None"], "correct": 0, "exp": "@media for different screens." },
    ],
    "hard": [
      { "q": "What is Event Bubbling?", "options": ["Event goes from child to parent", "Parent to child", "Stops event", "Creates event"], "correct": 0, "exp": "Events propagate up the DOM tree." },
      { "q": "What is CORS?", "options": ["Cross-Origin Resource Sharing", "Code Optimization", "Server Security", "Route Service"], "correct": 0, "exp": "Allows restricted resources on a web page." },
      { "q": "What is Hoisting?", "options": ["Declarations moved to top", "Lifting elements", "Server hosting", "API calls"], "correct": 0, "exp": "Variables/functions are moved to top of scope." },
      { "q": "Promises handle?", "options": ["Asynchronous operations", "Synchronous code", "Loops", "Variables"], "correct": 0, "exp": "Represents future completion of async task." },
      { "q": "What is SSR?", "options": ["Server Side Rendering", "Simple Site Route", "Static Site React", "Secure Socket Run"], "correct": 0, "exp": "HTML is generated on the server." },
      { "q": "Service Workers?", "options": ["Script runs in background", "Server admin", "Cleaner", "Bot"], "correct": 0, "exp": "Enables offline capabilities (PWA)." },
      { "q": "WebAssembly?", "options": ["Binary instruction format", "Web Assembler", "HTML Compiler", "None"], "correct": 0, "exp": "High performance in browser." },
      { "q": "Shadow DOM?", "options": ["Encapsulated DOM tree", "Dark mode", "Hidden virus", "Copy"], "correct": 0, "exp": "Scoped styles/markup (Web Components)." },
      { "q": "Critical Rendering Path?", "options": ["Steps to render page", "URL path", "Server route", "None"], "correct": 0, "exp": "HTML -> DOM -> CSSOM -> Render." },
      { "q": "Throttling vs Debouncing?", "options": ["Rate limiting execution", "Speeding up", "Deleting", "None"], "correct": 0, "exp": "Optimizes performance of events." },
      { "q": "HTTP/2 features?", "options": ["Multiplexing, header compression", "Slower", "Less secure", "None"], "correct": 0, "exp": "Faster than HTTP/1.1." },
      { "q": "What is a Polyfill?", "options": ["Code for missing features", "Color fill", "Image tool", "None"], "correct": 0, "exp": "Support for older browsers." },
      { "q": "Currying in JS?", "options": ["Transforming function args", "Cooking", "Spicy code", "None"], "correct": 0, "exp": "f(a,b) -> f(a)(b)." },
      { "q": "Prototypal Inheritance?", "options": ["Objects inherit from objects", "Class inheritance", "None", "Copying"], "correct": 0, "exp": "JS uses prototypes chain." },
      { "q": "What is Hydration?", "options": ["Adding JS to static HTML", "Drinking water", "Loading CSS", "None"], "correct": 0, "exp": "React attaches listeners to SSR HTML." },
    ],
  },
   "Java": {
    "easy": [
      { "q": "What is JVM?", "options": ["Java Virtual Machine", "Java Visual Mode", "Joint Virtual Memory", "Just Valid Method"], "correct": 0, "exp": "Engine that runs Java bytecode." },
      { "q": "int is a?", "options": ["Primitive type", "Class", "Object", "Reference"], "correct": 0, "exp": "int is a basic data type." },
      { "q": "Main method signature?", "options": ["public static void main", "void main", "static main", "public void main"], "correct": 0, "exp": "Standard entry point." },
      { "q": "What is an Object?", "options": ["Instance of a class", "A method", "A variable", "A library"], "correct": 0, "exp": "Objects are created from classes." },
      { "q": "What is Inheritance?", "options": ["Acquiring properties of parent class", "Hiding data", "Polymorphism", "Looping"], "correct": 0, "exp": "Mechanism for code reuse." },
      { "q": "What is JDK?", "options": ["Java Development Kit", "Java Developer Key", "Just Data Kit", "Joint Dev Kit"], "correct": 0, "exp": "SDK to develop Java apps." },
      { "q": "What is JRE?", "options": ["Java Runtime Environment", "Java Run Engine", "Just Run Error", "Joint Run Env"], "correct": 0, "exp": "Environment to run Java apps." },
      { "q": "What is a wrapper class?", "options": ["Object representation of primitive", "A package", "A method", "A loop"], "correct": 0, "exp": "Wraps primitives like int in objects like Integer." },
      { "q": "Default value of int?", "options": ["0", "1", "null", "undefined"], "correct": 0, "exp": "Primitive int defaults to 0." },
      { "q": "Default value of boolean?", "options": ["false", "true", "null", "0"], "correct": 0, "exp": "Primitive boolean defaults to false." },
      { "q": "Size of int?", "options": ["4 bytes", "2 bytes", "8 bytes", "1 byte"], "correct": 0, "exp": "32-bit signed integer." },
      { "q": "What is 'super' keyword?", "options": ["Refers to parent class", "Refers to object", "Refers to main", "Refers to static"], "correct": 0, "exp": "Used to access parent class members." },
      { "q": "Which is not an access modifier?", "options": ["virtual", "public", "private", "protected"], "correct": 0, "exp": "Virtual is not a Java keyword." },
      { "q": "Is Java 100% OOP?", "options": ["No", "Yes", "Maybe", "Depends"], "correct": 0, "exp": "No, because it uses primitive data types." },
      { "q": "Extension of Java file?", "options": [".java", ".js", ".class", ".txt"], "correct": 0, "exp": "Source code is saved as .java." },
    ],
    "medium": [
      { "q": "Difference: ArrayList vs LinkedList?", "options": ["Array vs Nodes", "Same", "Speed only", "Memory only"], "correct": 0, "exp": "ArrayList is dynamic array, LinkedList is double-linked." },
      { "q": "What is 'static'?", "options": ["Belongs to class", "Belongs to object", "Cannot change", "Private"], "correct": 0, "exp": "Shared across all instances." },
      { "q": "What is 'final'?", "options": ["Cannot be changed", "Last variable", "Public access", "Garbage collection"], "correct": 0, "exp": "Used for constants or preventing override." },
      { "q": "What is Abstract class?", "options": ["Cannot be instantiated", "Has no methods", "Is final", "Is static"], "correct": 0, "exp": "Used as a base for subclasses." },
      { "q": "What is an Interface?", "options": ["Blueprint of a class", "A variable", "An object", "A package"], "correct": 0, "exp": "Contains abstract methods only (mostly)." },
      { "q": "String vs StringBuilder?", "options": ["Immutable vs Mutable", "Same", "StringBuilder is slower", "None"], "correct": 0, "exp": "String cannot be changed, StringBuilder can." },
      { "q": "What is Method Overloading?", "options": ["Same name, different params", "Same name, same params", "Different class", "Overriding"], "correct": 0, "exp": "Compile-time polymorphism." },
      { "q": "What is Method Overriding?", "options": ["Same name/params in child class", "Different params", "Same class", "New method"], "correct": 0, "exp": "Runtime polymorphism." },
      { "q": "What is encapsulation?", "options": ["Wrapping data and methods", "Hiding implementation", "Inheriting", "Looping"], "correct": 0, "exp": "Protects data via private fields." },
      { "q": "Singleton pattern?", "options": ["Only one instance", "Multiple instances", "No instance", "Static class"], "correct": 0, "exp": "Ensures a class has only one instance." },
      { "q": "Comparable vs Comparator?", "options": ["Natural vs Custom sorting", "Same", "Interface vs Class", "None"], "correct": 0, "exp": "Comparable is internal, Comparator is external." },
      { "q": "Checked vs Unchecked Exceptions?", "options": ["Compile-time vs Runtime", "Fatal vs Non-fatal", "Fast vs Slow", "None"], "correct": 0, "exp": "Checked must be handled." },
      { "q": "What maps keys to values?", "options": ["HashMap", "ArrayList", "Set", "Queue"], "correct": 0, "exp": "Key-Value pairs." },
      { "q": "Try-Catch-Finally?", "options": ["Exception handling", "Looping", "If-else", "Methods"], "correct": 0, "exp": "Finally always executes." },
      { "q": "Default interface methods?", "options": ["Methods with body", "Abstract only", "Static only", "Private"], "correct": 0, "exp": "Introduced in Java 8." },
    ],
    "hard": [
      { "q": "What is the Diamond Problem?", "options": ["Multiple inheritance ambiguity", "Memory leak", "Thread deadlock", "Database locking"], "correct": 0, "exp": "Java avoids this via interfaces." },
      { "q": "What is Reflection?", "options": ["Inspect classes at runtime", "Mirror image", "Memory copying", "Graphics"], "correct": 0, "exp": "API to inspect/modify behavior at runtime." },
      { "q": "What is a Memory Leak?", "options": ["Unused objects referenced", "RAM failure", "Disk full", "Stack overflow"], "correct": 0, "exp": "GC cannot remove referenced objects." },
      { "q": "Volatile keyword?", "options": ["Thread visibility", "Constant", "Encryption", "Serialization"], "correct": 0, "exp": "Ensures value is read from main memory." },
      { "q": "Garbage Collection uses?", "options": ["Mark and Sweep", "FIFO", "LIFO", "Round Robin"], "correct": 0, "exp": "Algorithm to reclaim memory." },
      { "q": "What is JIT?", "options": ["Just-In-Time Compiler", "Java In Testing", "Just In Thread", "Joint Interface Type"], "correct": 0, "exp": "Compiles bytecode to native code at runtime." },
      { "q": "Strong vs Weak Reference?", "options": ["GC behavior diff", "Type diff", "Scope diff", "None"], "correct": 0, "exp": "Weak refs can be collected eagerly." },
      { "q": "What is a Daemon Thread?", "options": ["Background thread", "Main thread", "Virus", "Error"], "correct": 0, "exp": "Low priority thread like GC." },
      { "q": "Synchronized keyword?", "options": ["Thread safety", "Speed up", "Async", "Network"], "correct": 0, "exp": "Locks object/method for one thread." },
      { "q": "Internal working of HashMap?", "options": ["Hashing & Buckets", "Sorting", "Tree only", "List only"], "correct": 0, "exp": "Uses hashCode() and equals()." },
      { "q": "Classloader types?", "options": ["Bootstrap, Ext, App", "Main, Sub, Child", "Java, C, C++", "None"], "correct": 0, "exp": "Hierarchy of loaders." },
      { "q": "Fail-Fast vs Fail-Safe?", "options": ["Iterators behavior", "Error handling", "Thread safety", "None"], "correct": 0, "exp": "ConcurrentModificationException vs Copy." },
      { "q": "Fork/Join Framework?", "options": ["Parallel processing", "String joining", "Github", "None"], "correct": 0, "exp": "Work-stealing algorithm." },
      { "q": "Transient keyword?", "options": ["Skip serialization", "Temporary", "Volatile", "Static"], "correct": 0, "exp": "Field is not saved." },
      { "q": "Marker Interface?", "options": ["Empty interface", "Has methods", "Abstract", "Final"], "correct": 0, "exp": "Eg. Serializable, Cloneable." },
    ],
  },
  "Python": {
    "easy": [
      { "q": "How to output text?", "options": ["print()", "echo()", "log()", "write()"], "correct": 0, "exp": "Standard output function." },
      { "q": "Comment symbol?", "options": ["#", "//", "/*", "--"], "correct": 0, "exp": "Hash is used for comments." },
      { "q": "List is?", "options": ["Mutable", "Immutable", "Fixed", "Static"], "correct": 0, "exp": "Can be changed." },
      { "q": "Tuple is?", "options": ["Immutable", "Mutable", "Dynamic", "Slow"], "correct": 0, "exp": "Cannot be changed." },
      { "q": "Dictionary uses?", "options": ["Key-Value pairs", "Index", "Pointers", "Stack"], "correct": 0, "exp": "Maps keys to values." },
      { "q": "Extension of Python file?", "options": [".py", ".python", ".txt", ".p"], "correct": 0, "exp": "Standard extension." },
      { "q": "Create function keyword?", "options": ["def", "func", "function", "lambda"], "correct": 0, "exp": "Defines a function." },
      { "q": "Boolean values?", "options": ["True, False", "yes, no", "1, 0", "T, F"], "correct": 0, "exp": "Capitalized in Python." },
      { "q": "Loop types?", "options": ["for, while", "do-while", "foreach", "repeat"], "correct": 0, "exp": "Standard loops." },
      { "q": "Len() function?", "options": ["Returns length", "Returns size", "Prints", "Deletes"], "correct": 0, "exp": "Length of object." },
      { "q": "Integer division?", "options": ["//", "/", "%", "div"], "correct": 0, "exp": "Double slash." },
      { "q": "Exponent operator?", "options": ["**", "^", "pow", "exp"], "correct": 0, "exp": "Power operator." },
      { "q": "String slicing [::-1]?", "options": ["Reverses string", "Copies", "Errors", "Clears"], "correct": 0, "exp": "Reverse step." },
      { "q": "Input function?", "options": ["input()", "get()", "scan()", "read()"], "correct": 0, "exp": "Reads user input." },
      { "q": "Set properties?", "options": ["Unique elements", "Ordered", "Indexed", "Duplicates"], "correct": 0, "exp": "No duplicates." },
    ],
    "medium": [
      { "q": "What is a Decorator?", "options": ["Modifies function behavior", "Styling", "Class variable", "Loop"], "correct": 0, "exp": "Wraps a function." },
      { "q": "Lambda function is?", "options": ["Anonymous", "Named", "Large", "Class"], "correct": 0, "exp": "Single line anonymous function." },
      { "q": "__init__ is?", "options": ["Constructor", "Destructor", "Import", "Export"], "correct": 0, "exp": "Initializes objects." },
      { "q": "List comprehension?", "options": ["Concise way to create lists", "Sorting", "Deleting", "Printing"], "correct": 0, "exp": "Syntactic sugar for loops." },
      { "q": "What is 'self'?", "options": ["Instance reference", "Static keyword", "Global var", "Library"], "correct": 0, "exp": "Refers to current object." },
      { "q": "Difference: List vs Tuple?", "options": ["Mutable vs Immutable", "Same", "Speed", "None"], "correct": 0, "exp": "Tuples cannot change." },
      { "q": "*args and **kwargs?", "options": ["Variable arguments", "Pointers", "Multiplication", "Errors"], "correct": 0, "exp": "Positional and Keyword args." },
      { "q": "What is PEP 8?", "options": ["Style guide", "Version", "Compiler", "Library"], "correct": 0, "exp": "Coding conventions." },
      { "q": "What is __str__?", "options": ["String representation", "Constructor", "Destructor", "Int conv"], "correct": 0, "exp": "User-friendly string." },
      { "q": "Deep copy vs Shallow copy?", "options": ["Recursively copies vs Reference", "Same", "Fast vs Slow", "None"], "correct": 0, "exp": "Deep copy duplicates everything." },
      { "q": "Global keyword?", "options": ["Modifies global var", "Import", "Export", "All"], "correct": 0, "exp": "Access global scope." },
      { "q": "Pass statement?", "options": ["Do nothing", "Skip loop", "Return", "Stop"], "correct": 0, "exp": "Placeholder." },
      { "q": "Docstring?", "options": ["Documentation string", "String variable", "File path", "None"], "correct": 0, "exp": "Describes module/function." },
      { "q": "What is pip?", "options": ["Package installer", "Python Interpreter", "Path", "Protocol"], "correct": 0, "exp": "Installs libraries." },
      { "q": "Is and ==?", "options": ["Identity vs Value", "Same", "Math", "None"], "correct": 0, "exp": "'is' checks memory location." },
    ],
    "hard": [
      { "q": "What is GIL?", "options": ["Global Interpreter Lock", "Global Interface Logic", "General Input Loop", "Graphics Layer"], "correct": 0, "exp": "Limits Python to one thread at a time." },
      { "q": "Generators use?", "options": ["yield", "return", "stop", "pass"], "correct": 0, "exp": "Produces a sequence lazily." },
      { "q": "Method Resolution Order (MRO)?", "options": ["Class search order", "Memory order", "Function order", "Variable scope"], "correct": 0, "exp": "Determines inheritance order." },
      { "q": "Metaclass is?", "options": ["Class of a class", "Subclass", "Superclass", "Method"], "correct": 0, "exp": "Defines behavior of classes." },
      { "q": "Pickling is?", "options": ["Serialization", "Encryption", "Compression", "Sorting"], "correct": 0, "exp": "Converting object to byte stream." },
      { "q": "Context Manager?", "options": ["with statement", "for loop", "class", "function"], "correct": 0, "exp": "Manages resources (open/close)." },
      { "q": "Monkey Patching?", "options": ["Runtime dynamic modification", "Bugs", "Virus", "Animal"], "correct": 0, "exp": "Changing code at runtime." },
      { "q": "__new__ vs __init__?", "options": ["Create vs Initialize", "Same", "Old vs New", "None"], "correct": 0, "exp": "__new__ creates instance." },
      { "q": "What is a Decorator?", "options": ["Wraps function", "Class", "Variable", "Loop"], "correct": 0, "exp": "Meta-programming." },
      { "q": "Asyncio is for?", "options": ["Asynchronous I/O", "Audio", "Sync code", "DB"], "correct": 0, "exp": "Concurrent code." },
      { "q": "Cython?", "options": ["C-Extensions for Python", "New Python", "Cyber Python", "None"], "correct": 0, "exp": "Compiles to C for speed." },
      { "q": "__slots__?", "options": ["Memory optimization", "Game", "Array", "None"], "correct": 0, "exp": "Prevents creation of __dict__." },
      { "q": "WSGI?", "options": ["Web Server Gateway Interface", "Web Socket", "Wireless", "None"], "correct": 0, "exp": "Standard for Python web apps." },
      { "q": "What is PyPy?", "options": ["JIT Compiler implementation", "Library", "Code", "Tool"], "correct": 0, "exp": "Faster alternative to CPython." },
      { "q": "Duck Typing?", "options": ["Dynamic typing style", "Bird", "Slow", "Static"], "correct": 0, "exp": "If it walks/quacks like a duck." },
    ],
  },
  "Data Structures": {
    "easy": [
      { "q": "Stack follows?", "options": ["LIFO", "FIFO", "LILO", "FILO"], "correct": 0, "exp": "Last In, First Out." },
      { "q": "Queue follows?", "options": ["FIFO", "LIFO", "FILO", "LILO"], "correct": 0, "exp": "First In, First Out." },
      { "q": "Array access time?", "options": ["O(1)", "O(n)", "O(log n)", "O(n^2)"], "correct": 0, "exp": "Constant time access." },
      { "q": "Linked List uses?", "options": ["Pointers", "Indexes", "Keys", "Hashes"], "correct": 0, "exp": "Nodes point to next node." },
      { "q": "Tree root is?", "options": ["Top node", "Bottom node", "Middle node", "Leaf"], "correct": 0, "exp": "Starting point of tree." },
      { "q": "What is a Graph?", "options": ["Nodes and Edges", "Lines and Dots", "Table", "List"], "correct": 0, "exp": "Non-linear data structure." },
      { "q": "Push operation?", "options": ["Adds to stack", "Removes from stack", "Sorts", "Deletes"], "correct": 0, "exp": "Inserts element." },
      { "q": "Pop operation?", "options": ["Removes from stack", "Adds to stack", "Sorts", "Deletes"], "correct": 0, "exp": "Removes top element." },
      { "q": "Enqueue?", "options": ["Add to queue", "Remove from queue", "Sort", "Stack"], "correct": 0, "exp": "Adds to rear." },
      { "q": "Dequeue?", "options": ["Remove from queue", "Add to queue", "Sort", "Stack"], "correct": 0, "exp": "Removes from front." }
    ],
    "medium": [
      { "q": "Binary Search time?", "options": ["O(log n)", "O(n)", "O(1)", "O(n^2)"], "correct": 0, "exp": "Halves search space each step." },
      { "q": "Hash Table uses?", "options": ["Key mapping", "Sorting", "Tree", "Stack"], "correct": 0, "exp": "Maps keys to values." },
      { "q": "Merge Sort complexity?", "options": ["O(n log n)", "O(n^2)", "O(n)", "O(1)"], "correct": 0, "exp": "Divide and conquer algorithm." },
      { "q": "Graph traversal?", "options": ["BFS & DFS", "LIFO & FIFO", "Push & Pop", "Insert & Delete"], "correct": 0, "exp": "Breadth-First and Depth-First." },
      { "q": "What is a Heap?", "options": ["Tree-based structure", "Linear list", "Hash map", "Queue"], "correct": 0, "exp": "Used for priority queues." },
      { "q": "DFS uses?", "options": ["Stack", "Queue", "Array", "Tree"], "correct": 0, "exp": "Depth First Search." },
      { "q": "BFS uses?", "options": ["Queue", "Stack", "Array", "Graph"], "correct": 0, "exp": "Breadth First Search." },
      { "q": "Quick Sort average case?", "options": ["O(n log n)", "O(n^2)", "O(n)", "O(1)"], "correct": 0, "exp": "Efficient sorting." },
      { "q": "BST property?", "options": ["Left < Root < Right", "Left > Root", "Random", "Sorted"], "correct": 0, "exp": "Binary Search Tree." },
      { "q": "Adjacency Matrix?", "options": ["Graph representation", "List", "Tree", "Stack"], "correct": 0, "exp": "2D array for graph." }
    ],
    "hard": [
      { "q": "Dijkstra's Algorithm?", "options": ["Shortest path", "Sorting", "Searching", "Encryption"], "correct": 0, "exp": "Finds shortest path in graph." },
      { "q": "AVL Tree is?", "options": ["Self-balancing BST", "Unbalanced tree", "Heap", "Graph"], "correct": 0, "exp": "Maintains O(log n) height." },
      { "q": "Trie is used for?", "options": ["String prefix search", "Sorting numbers", "Graph path", "Database"], "correct": 0, "exp": "Efficient for dictionary words." },
      { "q": "Dynamic Programming?", "options": ["Overlapping subproblems", "Random guessing", "Greedy approach", "Recursion only"], "correct": 0, "exp": "Caches results to optimize." },
      { "q": "Floyd-Warshall?", "options": ["All-pairs shortest path", "Single source", "Sorting", "MST"], "correct": 0, "exp": "Finds paths between all pairs." },
      { "q": "A* Algorithm?", "options": ["Pathfinding", "Sorting", "Hashing", "Encryption"], "correct": 0, "exp": "Heuristic search." },
      { "q": "Red-Black Tree?", "options": ["Balanced BST", "Binary Tree", "Heap", "List"], "correct": 0, "exp": "Self-balancing." },
      { "q": "Topological Sort?", "options": ["DAG ordering", "Sorting numbers", "Tree traversal", "None"], "correct": 0, "exp": "Directed Acyclic Graph." },
      { "q": "Knapsack Problem?", "options": ["Optimization", "Sorting", "Searching", "Graph"], "correct": 0, "exp": "Dynamic programming classic." },
      { "q": "B-Tree?", "options": ["Self-balancing tree", "Binary tree", "Heap", "Stack"], "correct": 0, "exp": "Used in databases." }
    ],
  },
}

import hashlib

def seed_questions():
    if not db:
        print("❌ Firestore not initialized!")
        return

    print("🚀 Seeding Questions to Firestore...")
    batch = db.batch()
    count = 0

    for domain, levels in QUESTIONS.items():
        for level, questions in levels.items():
            for q in questions:
                # Create a deterministic ID based on the question text (prevent duplicates)
                doc_id = hashlib.md5(q["q"].encode()).hexdigest()
                doc_ref = db.collection("interview_questions").document(doc_id)
                
                # Payload
                data = {
                    "domain": domain,
                    "level": level,
                    "question": q["q"],
                    "options": q["options"],
                    "correct_index": q["correct"],
                    "explanation": q["exp"]
                }
                
                batch.set(doc_ref, data)
                count += 1
                
                # Firestore batch limit is 500
                if count % 400 == 0:
                    batch.commit()
                    batch = db.batch()
                    print(f"✅ Committed {count} questions...")

    batch.commit()
    print(f"Seeding Complete! Total migrated: {count}")
    with open("seed_log.txt", "w") as f:
        f.write(f"Seeding Complete! Total migrated: {count}\n")
    
if __name__ == "__main__":
    try:
        seed_questions()
    except Exception as e:
        with open("seed_log.txt", "w") as f:
            f.write(f"Error: {e}")
