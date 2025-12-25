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
    ],
    "medium": [
      { "q": "What is Bias?", "options": ["Simplifying assumptions", "Variance", "Noise", "Outliers"], "correct": 0, "exp": "High bias causes underfitting." },
      { "q": "What is Variance?", "options": ["Sensitivity to fluctuations", "Bias", "Error", "Accuracy"], "correct": 0, "exp": "High variance causes overfitting." },
      { "q": "Gradient Descent is?", "options": ["Optimization algorithm", "Loss function", "Metric", "Model"], "correct": 0, "exp": "It minimizes the cost function." },
      { "q": "What is One-Hot Encoding?", "options": ["Categorical to binary", "Binary to text", "Image processing", "Data cleaning"], "correct": 0, "exp": "Converts categories into binary vectors." },
      { "q": "What is a Confusion Matrix?", "options": ["Performance measurement", "Error type", "Data structure", "Algorithm"], "correct": 0, "exp": "Table used to evaluate classification models." },
    ],
    "hard": [
      { "q": "What is Backpropagation?", "options": ["Updating weights based on error", "Forward pass", "Initialization", "Activation"], "correct": 0, "exp": "Core algorithm for training neural networks." },
      { "q": "Vanishing Gradient problem affects?", "options": ["Deep networks (RNNs)", "Linear regression", "K-Means", "Random Forest"], "correct": 0, "exp": "Gradients become too small to update weights." },
      { "q": "What is Drop-out?", "options": ["Regularization technique", "Optimization", "Loss function", "Activation"], "correct": 0, "exp": "Randomly ignores neurons to prevent overfitting." },
      { "q": "BERT is based on?", "options": ["Transformers", "RNN", "CNN", "LSTM"], "correct": 0, "exp": "BERT uses the Transformer architecture." },
      { "q": "What is GAN?", "options": ["Generative Adversarial Network", "Graph Area Network", "Global AI Node", "General Auto Norm"], "correct": 0, "exp": "Two networks competing to generate new data." },
    ],
  },
  "Web Development": {
    "easy": [
      { "q": "HTML stands for?", "options": ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tool ML", "None"], "correct": 0, "exp": "Standard markup language for web." },
      { "q": "CSS is used for?", "options": ["Styling", "Logic", "Database", "Server"], "correct": 0, "exp": "Cascading Style Sheets control layout." },
      { "q": "What is the DOM?", "options": ["Document Object Model", "Data Object Mode", "Disk OS Mode", "Digital Ordinance Model"], "correct": 0, "exp": "DOM represents the page structure." },
      { "q": "Which tag creates a link?", "options": ["<a>", "<link>", "<href>", "<url>"], "correct": 0, "exp": "The anchor tag <a> defines hyperlinks." },
      { "q": "What is HTTP?", "options": ["Protocol for fetching resources", "Programming Language", "Database", "Browser"], "correct": 0, "exp": "HyperText Transfer Protocol." },
    ],
    "medium": [
      { "q": "What is the Virtual DOM?", "options": ["Lightweight copy of DOM", "A VR tool", "Browser engine", "Server file"], "correct": 0, "exp": "React uses it for performance." },
      { "q": "What is a Closure?", "options": ["Function with lexical environment", "Closing a tag", "Ending a loop", "Error type"], "correct": 0, "exp": "Function remembering variables from outer scope." },
      { "q": "Difference: == vs ===?", "options": ["Value vs Value & Type", "No difference", "Assignment vs Compare", "Speed"], "correct": 0, "exp": "=== checks types as well." },
      { "q": "What is 'this' in JS?", "options": ["Reference to object", "A variable", "A function", "Global scope"], "correct": 0, "exp": "Refers to the object executing the code." },
      { "q": "What is Flexbox?", "options": ["One-dimensional layout method", "Animation tool", "Database", "Testing tool"], "correct": 0, "exp": "CSS module for flexible layouts." },
    ],
    "hard": [
      { "q": "What is Event Bubbling?", "options": ["Event goes from child to parent", "Parent to child", "Stops event", "Creates event"], "correct": 0, "exp": "Events propagate up the DOM tree." },
      { "q": "What is CORS?", "options": ["Cross-Origin Resource Sharing", "Code Optimization", "Server Security", "Route Service"], "correct": 0, "exp": "Allows restricted resources on a web page." },
      { "q": "What is Hoisting?", "options": ["Declarations moved to top", "Lifting elements", "Server hosting", "API calls"], "correct": 0, "exp": "Variables/functions are moved to top of scope." },
      { "q": "Promises handle?", "options": ["Asynchronous operations", "Synchronous code", "Loops", "Variables"], "correct": 0, "exp": "Represents future completion of async task." },
      { "q": "What is SSR?", "options": ["Server Side Rendering", "Simple Site Route", "Static Site React", "Secure Socket Run"], "correct": 0, "exp": "HTML is generated on the server." },
    ],
  },
   "Java": {
    "easy": [
      { "q": "What is JVM?", "options": ["Java Virtual Machine", "Java Visual Mode", "Joint Virtual Memory", "Just Valid Method"], "correct": 0, "exp": "Engine that runs Java bytecode." },
      { "q": "int is a?", "options": ["Primitive type", "Class", "Object", "Reference"], "correct": 0, "exp": "int is a basic data type." },
      { "q": "Main method signature?", "options": ["public static void main", "void main", "static main", "public void main"], "correct": 0, "exp": "Standard entry point." },
      { "q": "What is an Object?", "options": ["Instance of a class", "A method", "A variable", "A library"], "correct": 0, "exp": "Objects are created from classes." },
      { "q": "What is Inheritance?", "options": ["Acquiring properties of parent class", "Hiding data", "Polymorphism", "Looping"], "correct": 0, "exp": "Mechanism for code reuse." },
    ],
    "medium": [
      { "q": "Difference: ArrayList vs LinkedList?", "options": ["Array vs Nodes", "Same", "Speed only", "Memory only"], "correct": 0, "exp": "ArrayList is dynamic array, LinkedList is double-linked." },
      { "q": "What is 'static'?", "options": ["Belongs to class", "Belongs to object", "Cannot change", "Private"], "correct": 0, "exp": "Shared across all instances." },
      { "q": "What is 'final'?", "options": ["Cannot be changed", "Last variable", "Public access", "Garbage collection"], "correct": 0, "exp": "Used for constants or preventing override." },
      { "q": "What is Abstract class?", "options": ["Cannot be instantiated", "Has no methods", "Is final", "Is static"], "correct": 0, "exp": "Used as a base for subclasses." },
      { "q": "What is an Interface?", "options": ["Blueprint of a class", "A variable", "An object", "A package"], "correct": 0, "exp": "Contains abstract methods only (mostly)." },
    ],
    "hard": [
      { "q": "What is the Diamond Problem?", "options": ["Multiple inheritance ambiguity", "Memory leak", "Thread deadlock", "Database locking"], "correct": 0, "exp": "Java avoids this via interfaces." },
      { "q": "What is Reflection?", "options": ["Inspect classes at runtime", "Mirror image", "Memory copying", "Graphics"], "correct": 0, "exp": "API to inspect/modify behavior at runtime." },
      { "q": "What is a Memory Leak?", "options": ["Unused objects referenced", "RAM failure", "Disk full", "Stack overflow"], "correct": 0, "exp": "GC cannot remove referenced objects." },
      { "q": "Volatile keyword?", "options": ["Thread visibility", "Constant", "Encryption", "Serialization"], "correct": 0, "exp": "Ensures value is read from main memory." },
      { "q": "Garbage Collection uses?", "options": ["Mark and Sweep", "FIFO", "LIFO", "Round Robin"], "correct": 0, "exp": "Algorithm to reclaim memory." },
    ],
  },
  "Python": {
    "easy": [
      { "q": "How to output text?", "options": ["print()", "echo()", "log()", "write()"], "correct": 0, "exp": "Standard output function." },
      { "q": "Comment symbol?", "options": ["#", "//", "/*", "--"], "correct": 0, "exp": "Hash is used for comments." },
      { "q": "List is?", "options": ["Mutable", "Immutable", "Fixed", "Static"], "correct": 0, "exp": "Can be changed." },
      { "q": "Tuple is?", "options": ["Immutable", "Mutable", "Dynamic", "Slow"], "correct": 0, "exp": "Cannot be changed." },
      { "q": "Dictionary uses?", "options": ["Key-Value pairs", "Index", "Pointers", "Stack"], "correct": 0, "exp": "Maps keys to values." },
    ],
    "medium": [
      { "q": "What is a Decorator?", "options": ["Modifies function behavior", "Styling", "Class variable", "Loop"], "correct": 0, "exp": "Wraps a function." },
      { "q": "Lambda function is?", "options": ["Anonymous", "Named", "Large", "Class"], "correct": 0, "exp": "Single line anonymous function." },
      { "q": "__init__ is?", "options": ["Constructor", "Destructor", "Import", "Export"], "correct": 0, "exp": "Initializes objects." },
      { "q": "List comprehension?", "options": ["Concise way to create lists", "Sorting", "Deleting", "Printing"], "correct": 0, "exp": "Syntactic sugar for loops." },
      { "q": "What is 'self'?", "options": ["Instance reference", "Static keyword", "Global var", "Library"], "correct": 0, "exp": "Refers to current object." },
    ],
    "hard": [
      { "q": "What is GIL?", "options": ["Global Interpreter Lock", "Global Interface Logic", "General Input Loop", "Graphics Layer"], "correct": 0, "exp": "Limits Python to one thread at a time." },
      { "q": "Generators use?", "options": ["yield", "return", "stop", "pass"], "correct": 0, "exp": "Produces a sequence lazily." },
      { "q": "Method Resolution Order (MRO)?", "options": ["Class search order", "Memory order", "Function order", "Variable scope"], "correct": 0, "exp": "Determines inheritance order." },
      { "q": "Metaclass is?", "options": ["Class of a class", "Subclass", "Superclass", "Method"], "correct": 0, "exp": "Defines behavior of classes." },
      { "q": "Pickling is?", "options": ["Serialization", "Encryption", "Compression", "Sorting"], "correct": 0, "exp": "Converting object to byte stream." },
    ],
  },
  "Data Structures": {
    "easy": [
      { "q": "Stack follows?", "options": ["LIFO", "FIFO", "LILO", "FILO"], "correct": 0, "exp": "Last In, First Out." },
      { "q": "Queue follows?", "options": ["FIFO", "LIFO", "FILO", "LILO"], "correct": 0, "exp": "First In, First Out." },
      { "q": "Array access time?", "options": ["O(1)", "O(n)", "O(log n)", "O(n^2)"], "correct": 0, "exp": "Constant time access." },
      { "q": "Linked List uses?", "options": ["Pointers", "Indexes", "Keys", "Hashes"], "correct": 0, "exp": "Nodes point to next node." },
      { "q": "Tree root is?", "options": ["Top node", "Bottom node", "Middle node", "Leaf"], "correct": 0, "exp": "Starting point of tree." },
    ],
    "medium": [
      { "q": "Binary Search time?", "options": ["O(log n)", "O(n)", "O(1)", "O(n^2)"], "correct": 0, "exp": "Halves search space each step." },
      { "q": "Hash Table uses?", "options": ["Key mapping", "Sorting", "Tree", "Stack"], "correct": 0, "exp": "Maps keys to values." },
      { "q": "Merge Sort complexity?", "options": ["O(n log n)", "O(n^2)", "O(n)", "O(1)"], "correct": 0, "exp": "Divide and conquer algorithm." },
      { "q": "Graph traversal?", "options": ["BFS & DFS", "LIFO & FIFO", "Push & Pop", "Insert & Delete"], "correct": 0, "exp": "Breadth-First and Depth-First." },
      { "q": "What is a Heap?", "options": ["Tree-based structure", "Linear list", "Hash map", "Queue"], "correct": 0, "exp": "Used for priority queues." },
    ],
    "hard": [
      { "q": "Dijkstra's Algorithm?", "options": ["Shortest path", "Sorting", "Searching", "Encryption"], "correct": 0, "exp": "Finds shortest path in graph." },
      { "q": "AVL Tree is?", "options": ["Self-balancing BST", "Unbalanced tree", "Heap", "Graph"], "correct": 0, "exp": "Maintains O(log n) height." },
      { "q": "Trie is used for?", "options": ["String prefix search", "Sorting numbers", "Graph path", "Database"], "correct": 0, "exp": "Efficient for dictionary words." },
      { "q": "Dynamic Programming?", "options": ["Overlapping subproblems", "Random guessing", "Greedy approach", "Recursion only"], "correct": 0, "exp": "Caches results to optimize." },
      { "q": "Floyd-Warshall?", "options": ["All-pairs shortest path", "Single source", "Sorting", "MST"], "correct": 0, "exp": "Finds paths between all pairs." },
    ],
  },
  "Database / SQL": {
    "easy": [
      { "q": "SQL stands for?", "options": ["Structured Query Language", "Simple Query List", "Standard Question Log", "System Queue Logic"], "correct": 0, "exp": "Language for RDBMS." },
      { "q": "Primary Key is?", "options": ["Unique identifier", "Duplicate value", "Foreign link", "Null value"], "correct": 0, "exp": "Uniquely identifies a record." },
      { "q": "SELECT command?", "options": ["Retrieves data", "Deletes data", "Updates data", "Inserts data"], "correct": 0, "exp": "Fetches rows from table." },
      { "q": "What is a Table?", "options": ["Collection of rows/cols", "A query", "A key", "A database"], "correct": 0, "exp": "Stores structured data." },
      { "q": "WHERE clause?", "options": ["Filters records", "Sorts records", "Groups records", "Joins tables"], "correct": 0, "exp": "Specifies conditions." },
    ],
    "medium": [
      { "q": "Foreign Key?", "options": ["Links two tables", "Primary key", "Unique key", "Index"], "correct": 0, "exp": "Enforces referential integrity." },
      { "q": "JOIN types?", "options": ["Inner, Outer, Left, Right", "Up, Down, Left, Right", "Add, Sub, Mul, Div", "None"], "correct": 0, "exp": "Combines rows from tables." },
      { "q": "Normalization?", "options": ["Organizing data to reduce redundancy", "Creating backups", "Deleting data", "Sorting"], "correct": 0, "exp": "Minimizes duplication." },
      { "q": "GROUP BY?", "options": ["Groups rows with same values", "Sorts rows", "Filters rows", "Deletes rows"], "correct": 0, "exp": "Used with aggregate functions." },
      { "q": "ACID properties?", "options": ["Atomicity, Consistency, Isolation, Durability", "Access, Control, ID, Data", "Auto, Const, Iso, Dur", "None"], "correct": 0, "exp": "Ensures reliable transactions." },
    ],
    "hard": [
      { "q": "Indexing?", "options": ["Optimizes search speed", "Compresses data", "Encrypts data", "Sorts view"], "correct": 0, "exp": "Data structure for fast retrieval." },
      { "q": "Stored Procedure?", "options": ["Precompiled SQL code", "Temporary table", "Trigger", "View"], "correct": 0, "exp": "Reusable SQL logic." },
      { "q": "Trigger?", "options": ["Auto-executed on event", "Manual script", "Button", "Key"], "correct": 0, "exp": "Runs on Insert/Update/Delete." },
      { "q": "NoSQL example?", "options": ["MongoDB", "MySQL", "PostgreSQL", "Oracle"], "correct": 0, "exp": "Document-based database." },
      { "q": "Denormalization?", "options": ["Adding redundancy for performance", "Removing data", "Cleaning data", "Splitting tables"], "correct": 0, "exp": "Trade-off for read speed." },
    ],
  },
  "Operating Systems": {
    "easy": [
      { "q": "OS stands for?", "options": ["Operating System", "Open Source", "Optical Sensor", "Output Stream"], "correct": 0, "exp": "Manages hardware and software." },
      { "q": "Kernel is?", "options": ["Core of OS", "Shell", "Application", "Hardware"], "correct": 0, "exp": "Controls system resources." },
      { "q": "What is a Process?", "options": ["Program in execution", "A file", "A folder", "A user"], "correct": 0, "exp": "Active instance of a program." },
      { "q": "RAM is?", "options": ["Volatile memory", "Permanent storage", "CPU cache", "Disk"], "correct": 0, "exp": "Random Access Memory." },
      { "q": "GUI stands for?", "options": ["Graphical User Interface", "General User Input", "Global Unit Index", "Game UI"], "correct": 0, "exp": "Visual interface." },
    ],
    "medium": [
      { "q": "What is a Thread?", "options": ["Lightweight process", "A wire", "A file", "A signal"], "correct": 0, "exp": "Unit of execution within process." },
      { "q": "Deadlock?", "options": ["Processes waiting indefinitely", "System crash", "Slow speed", "Memory full"], "correct": 0, "exp": "Circular wait condition." },
      { "q": "Virtual Memory?", "options": ["Simulated RAM using disk", "Cloud storage", "Cache", "ROM"], "correct": 0, "exp": "Extends physical memory." },
      { "q": "Semaphore?", "options": ["Synchronization variable", "Process ID", "File name", "Signal"], "correct": 0, "exp": "Controls access to resources." },
      { "q": "Context Switching?", "options": ["CPU switches processes", "User switches apps", "Power off", "Login"], "correct": 0, "exp": "Saving/loading process state." },
    ],
    "hard": [
      { "q": "Thrashing?", "options": ["Excessive paging", "CPU overheating", "Disk crash", "Fast processing"], "correct": 0, "exp": "OS spends more time swapping than executing." },
      { "q": "Mutex vs Semaphore?", "options": ["Locking vs Signaling", "Same", "Speed", "Size"], "correct": 0, "exp": "Mutex is for locking, Semaphore for counting." },
      { "q": "Paging?", "options": ["Memory management scheme", "Messaging", "Printing", "Scheduling"], "correct": 0, "exp": "Divides memory into fixed blocks." },
      { "q": "Race Condition?", "options": ["Outcome depends on order", "Fast process", "Network lag", "Error"], "correct": 0, "exp": "Concurrency bug." },
      { "q": "Kernel Panic?", "options": ["Fatal system error", "Warning", "Restart", "Slowdown"], "correct": 0, "exp": "OS cannot recover safely." },
    ],
  },
  "Computer Networks": {
    "easy": [
      { "q": "IP stands for?", "options": ["Internet Protocol", "Internal Process", "Input Port", "Intra Phone"], "correct": 0, "exp": "Addressing protocol." },
      { "q": "LAN stands for?", "options": ["Local Area Network", "Large Area Net", "Local Access Node", "Line Area Net"], "correct": 0, "exp": "Network in small area." },
      { "q": "Router does?", "options": ["Routes packets", "Stores files", "Prints", "Displays video"], "correct": 0, "exp": "Directs traffic." },
      { "q": "HTTP port?", "options": ["80", "443", "21", "22"], "correct": 0, "exp": "Standard web port." },
      { "q": "DNS?", "options": ["Domain Name System", "Data Name Service", "Digital Net Source", "Domain Net Server"], "correct": 0, "exp": "Maps names to IPs." },
    ],
    "medium": [
      { "q": "OSI Model layers?", "options": ["7", "5", "4", "6"], "correct": 0, "exp": "Physical to Application." },
      { "q": "TCP vs UDP?", "options": ["Reliable vs Fast", "Slow vs Fast", "Same", "Secure vs Open"], "correct": 0, "exp": "TCP guarantees delivery." },
      { "q": "MAC Address?", "options": ["Physical address", "Logical address", "Email", "URL"], "correct": 0, "exp": "Hardware ID." },
      { "q": "What is Ping?", "options": ["Network utility", "Game", "Sound", "Error"], "correct": 0, "exp": "Tests connectivity." },
      { "q": "Subnet Mask?", "options": ["Divides IP address", "Hides IP", "Encrypts IP", "Deletes IP"], "correct": 0, "exp": "Separates network/host." },
    ],
    "hard": [
      { "q": "Three-way Handshake?", "options": ["TCP connection setup", "UDP setup", "HTTP request", "SSL handshake"], "correct": 0, "exp": "SYN, SYN-ACK, ACK." },
      { "q": "ARP?", "options": ["Address Resolution Protocol", "All Route Path", "Area Range Port", "Access Role Protocol"], "correct": 0, "exp": "Maps IP to MAC." },
      { "q": "DHCP?", "options": ["Dynamic Host Config Protocol", "Data Host Control", "Domain Host Connect", "Digital Host CP"], "correct": 0, "exp": "Assigns IPs automatically." },
      { "q": "BGP?", "options": ["Border Gateway Protocol", "Big Gate Port", "Back Gate Path", "Basic Group Protocol"], "correct": 0, "exp": "Routing between ISPs." },
      { "q": "VLAN?", "options": ["Virtual LAN", "Video LAN", "Voice LAN", "Very Large Network"], "correct": 0, "exp": "Logical network segmentation." },
    ],
  },
  "Cyber Security": {
    "easy": [
      { "q": "Phishing?", "options": ["Deceptive email", "Fishing", "Coding", "Testing"], "correct": 0, "exp": "Tricks users into revealing info." },
      { "q": "Firewall?", "options": ["Network security system", "Physical wall", "Virus", "Antivirus"], "correct": 0, "exp": "Filters traffic." },
      { "q": "Malware?", "options": ["Malicious software", "Hardware", "Good software", "Update"], "correct": 0, "exp": "Harmful programs." },
      { "q": "VPN?", "options": ["Virtual Private Network", "Virtual Public Net", "Voice Private Net", "Visual Port Net"], "correct": 0, "exp": "Secure connection." },
      { "q": "Password should be?", "options": ["Strong & unique", "123456", "Name", "Short"], "correct": 0, "exp": "Prevents brute force." },
    ],
    "medium": [
      { "q": "Encryption?", "options": ["Encoding data", "Deleting data", "Compressing", "Sending"], "correct": 0, "exp": "Protects confidentiality." },
      { "q": "2FA?", "options": ["Two-Factor Authentication", "2 Fast Access", "To For All", "Two Files Auth"], "correct": 0, "exp": "Adds security layer." },
      { "q": "DDOS?", "options": ["Distributed Denial of Service", "Data Disk OS", "Direct Domain OS", "Double DOS"], "correct": 0, "exp": "Overwhelms server." },
      { "q": "SQL Injection?", "options": ["Malicious SQL query", "Database update", "New table", "Login"], "correct": 0, "exp": "Exploits input fields." },
      { "q": "HTTPS?", "options": ["Secure HTTP", "Slow HTTP", "Super HTTP", "Standard HTTP"], "correct": 0, "exp": "Encrypted web traffic." },
    ],
    "hard": [
      { "q": "XSS?", "options": ["Cross-Site Scripting", "XML Site Sheet", "X-Ray System", "Extra Secure Site"], "correct": 0, "exp": "Injects scripts into trusted sites." },
      { "q": "Zero-day exploit?", "options": ["Unknown vulnerability", "Old virus", "Patch", "Update"], "correct": 0, "exp": "No fix available yet." },
      { "q": "Man-in-the-Middle?", "options": ["Attacker intercepts comms", "Server error", "Cable cut", "Wifi issue"], "correct": 0, "exp": "Eavesdropping attack." },
      { "q": "Ransomware?", "options": ["Encrypts files for money", "Steals password", "Slows PC", "Shows ads"], "correct": 0, "exp": "Extortion malware." },
      { "q": "Penetration Testing?", "options": ["Simulated cyber attack", "Hardware test", "Speed test", "User survey"], "correct": 0, "exp": "Finds security flaws." },
    ],
  },
  "Cloud Computing": {
    "easy": [
      { "q": "AWS stands for?", "options": ["Amazon Web Services", "All Web Server", "Auto Web System", "Apple Web Store"], "correct": 0, "exp": "Cloud provider." },
      { "q": "SaaS?", "options": ["Software as a Service", "System as a Service", "Storage as a Service", "Soft as a Server"], "correct": 0, "exp": "Software over internet." },
      { "q": "Cloud Storage?", "options": ["Online data storage", "Hard drive", "USB", "CD"], "correct": 0, "exp": "Google Drive, Dropbox, etc." },
      { "q": "Scalability?", "options": ["Handle growing load", "Measuring weight", "Screen size", "Cost"], "correct": 0, "exp": "Ability to expand." },
      { "q": "Public Cloud?", "options": ["Shared infrastructure", "Private server", "Local PC", "Offline"], "correct": 0, "exp": "Accessible to general public." },
    ],
    "medium": [
      { "q": "IaaS?", "options": ["Infrastructure as a Service", "Internet as a Service", "Input as a Service", "Image as a Service"], "correct": 0, "exp": "Virtual machines, networking." },
      { "q": "PaaS?", "options": ["Platform as a Service", "Public as a Service", "Private as a Service", "Port as a Service"], "correct": 0, "exp": "Tools for developers." },
      { "q": "Docker?", "options": ["Containerization platform", "Ship", "Operating System", "Database"], "correct": 0, "exp": "Packages apps." },
      { "q": "Kubernetes?", "options": ["Container orchestration", "Game", "Language", "Cloud"], "correct": 0, "exp": "Manages containers." },
      { "q": "Virtualization?", "options": ["Creating virtual version", "Reality", "Gaming", "Coding"], "correct": 0, "exp": "VMs on hardware." },
    ],
    "hard": [
      { "q": "Serverless?", "options": ["Run code without managing servers", "No code", "No internet", "No database"], "correct": 0, "exp": "AWS Lambda, Azure Functions." },
      { "q": "Load Balancer?", "options": ["Distributes traffic", "Weighs servers", "Checks power", "Costs money"], "correct": 0, "exp": "Prevents overload." },
      { "q": "Hybrid Cloud?", "options": ["Public + Private", "Two Public", "Two Private", "None"], "correct": 0, "exp": "Mix of environments." },
      { "q": "Microservices?", "options": ["Small independent services", "One big app", "Tiny computer", "Micro chip"], "correct": 0, "exp": "Architectural style." },
      { "q": "CDN?", "options": ["Content Delivery Network", "Cloud Data Net", "Central Disk Node", "Code Domain Name"], "correct": 0, "exp": "Speeds up content globally." },
    ],
  },
  "Frontend Development": {
    "easy": [
      { "q": "HTML stands for?", "options": ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tool ML", "None"], "correct": 0, "exp": "Standard markup language for web." },
      { "q": "CSS is used for?", "options": ["Styling", "Logic", "Database", "Server"], "correct": 0, "exp": "Cascading Style Sheets control layout." },
      { "q": "What is the DOM?", "options": ["Document Object Model", "Data Object Mode", "Disk OS Mode", "Digital Ordinance Model"], "correct": 0, "exp": "DOM represents the page structure." },
      { "q": "Which tag creates a link?", "options": ["<a>", "<link>", "<href>", "<url>"], "correct": 0, "exp": "The anchor tag <a> defines hyperlinks." },
      { "q": "What is HTTP?", "options": ["Protocol for fetching resources", "Programming Language", "Database", "Browser"], "correct": 0, "exp": "HyperText Transfer Protocol." },
    ],
    "medium": [
      { "q": "What is the Virtual DOM?", "options": ["Lightweight copy of DOM", "A VR tool", "Browser engine", "Server file"], "correct": 0, "exp": "React uses it for performance." },
      { "q": "What is a Closure?", "options": ["Function with lexical environment", "Closing a tag", "Ending a loop", "Error type"], "correct": 0, "exp": "Function remembering variables from outer scope." },
      { "q": "Difference: == vs ===?", "options": ["Value vs Value & Type", "No difference", "Assignment vs Compare", "Speed"], "correct": 0, "exp": "=== checks types as well." },
      { "q": "What is 'this' in JS?", "options": ["Reference to object", "A variable", "A function", "Global scope"], "correct": 0, "exp": "Refers to the object executing the code." },
      { "q": "What is Flexbox?", "options": ["One-dimensional layout method", "Animation tool", "Database", "Testing tool"], "correct": 0, "exp": "CSS module for flexible layouts." },
    ],
    "hard": [
      { "q": "What is Event Bubbling?", "options": ["Event goes from child to parent", "Parent to child", "Stops event", "Creates event"], "correct": 0, "exp": "Events propagate up the DOM tree." },
      { "q": "What is CORS?", "options": ["Cross-Origin Resource Sharing", "Code Optimization", "Server Security", "Route Service"], "correct": 0, "exp": "Allows restricted resources on a web page." },
      { "q": "What is Hoisting?", "options": ["Declarations moved to top", "Lifting elements", "Server hosting", "API calls"], "correct": 0, "exp": "Variables/functions are moved to top of scope." },
      { "q": "Promises handle?", "options": ["Asynchronous operations", "Synchronous code", "Loops", "Variables"], "correct": 0, "exp": "Represents future completion of async task." },
      { "q": "What is SSR?", "options": ["Server Side Rendering", "Simple Site Route", "Static Site React", "Secure Socket Run"], "correct": 0, "exp": "HTML is generated on the server." },
    ],
  },
  "Backend Development": {
    "easy": [
      { "q": "What is a REST API?", "options": ["Representational State Transfer", "Resting API", "Random State Transfer", "Real Time API"], "correct": 0, "exp": "Architectural style for web services." },
      { "q": "Node.js is?", "options": ["JS runtime environment", "A Framework", "A Database", "An OS"], "correct": 0, "exp": "Executes JS outside browser." },
      { "q": "What is Middleware?", "options": ["Software bridge", "Virus", "Hardware", "Database"], "correct": 0, "exp": "Code running between request and response." },
      { "q": "Status code 200?", "options": ["OK", "Error", "Not Found", "Created"], "correct": 0, "exp": "Standard success code." },
      { "q": "What is JSON?", "options": ["JavaScript Object Notation", "Java Sorting Object", "Jupyter Source Node", "None"], "correct": 0, "exp": "Data interchange format." },
    ],
    "medium": [
      { "q": "SQL vs NoSQL?", "options": ["Structured vs Flexible", "Fast vs Slow", "Old vs New", "Local vs Cloud"], "correct": 0, "exp": "Relational vs Document/Key-Value." },
      { "q": "What is JWT?", "options": ["JSON Web Token", "Java Web Tool", "Jupyter Web Test", "Just Web Text"], "correct": 0, "exp": "Used for secure transmission." },
      { "q": "Horizontal Scaling?", "options": ["Adding more machines", "Upgrading hardware", "Deleting data", "Optimizing code"], "correct": 0, "exp": "Distributing load across servers." },
      { "q": "What is an ORM?", "options": ["Object-Relational Mapping", "Object Random Memory", "Ordered Real Mode", "Output Read Mode"], "correct": 0, "exp": "Converts data between incompatible type systems." },
      { "q": "What is Pagination?", "options": ["Dividing content into pages", "Deleting pages", "Sorting pages", "Printing"], "correct": 0, "exp": "Optimizes large data retrieval." },
    ],
    "hard": [
      { "q": "CAP Theorem?", "options": ["Consistency, Availability, Partition", "CPU, APU, PPU", "Cache, App, Port", "Code, App, Program"], "correct": 0, "exp": "Distributed store trade-offs." },
      { "q": "Microservices vs Monolith?", "options": ["Distributed vs Single Unit", "Small vs Big", "Fast vs Slow", "New vs Old"], "correct": 0, "exp": "Architecture styles." },
      { "q": "What is GraphQL?", "options": ["Query language for APIs", "Database", "Graph tool", "Chart library"], "correct": 0, "exp": "Allows clients to request specific data." },
      { "q": "Rate Limiting?", "options": ["Control traffic rate", "Speed up internet", "Count money", "Measure weight"], "correct": 0, "exp": "Prevents abuse." },
      { "q": "Message Queue?", "options": ["Async communication", "Email list", "Chat app", "Database"], "correct": 0, "exp": "Decouples services (e.g., RabbitMQ, Kafka)." },
    ],
  },
  "Full Stack Development": {
    "easy": [
      { "q": "What connects Frontend & Backend?", "options": ["API", "HTML", "CSS", "Database"], "correct": 0, "exp": "Application Programming Interface." },
      { "q": "What is MVC?", "options": ["Model View Controller", "Main View Code", "Master Video Control", "Mobile View Cell"], "correct": 0, "exp": "Design pattern." },
      { "q": "Git is for?", "options": ["Version Control", "Design", "Testing", "Hosting"], "correct": 0, "exp": "Tracks code changes." },
      { "q": "What is npm?", "options": ["Node Package Manager", "New Project Manager", "Node Program Mode", "None"], "correct": 0, "exp": "Package manager for JS." },
      { "q": "Client-side vs Server-side?", "options": ["Browser vs Server", "Left vs Right", "Up vs Down", "User vs Admin"], "correct": 0, "exp": "Where code executes." },
    ],
    "medium": [
      { "q": "CORS issues happen when?", "options": ["Different origins", "Same origin", "Offline", "Slow network"], "correct": 0, "exp": "Security feature of browsers." },
      { "q": "What is Webpack?", "options": ["Module Bundler", "Browser", "Editor", "Language"], "correct": 0, "exp": "Bundles assets." },
      { "q": "Session vs Token?", "options": ["Server state vs Stateless", "Same", "Fast vs Slow", "Old vs New"], "correct": 0, "exp": "Auth mechanisms." },
      { "q": "React Props vs State?", "options": ["Passed vs Managed", "Static vs Dynamic", "Global vs Local", "None"], "correct": 0, "exp": "Data flow in React." },
      { "q": "Environment Variables?", "options": ["Config values", "Global vars", "UI themes", "Functions"], "correct": 0, "exp": "Secrets/config outside code." },
    ],
    "hard": [
      { "q": "SSR benefits?", "options": ["SEO & Initial Load", "Easier code", "Less server load", "No benefits"], "correct": 0, "exp": "Search engines can crawl." },
      { "q": "WebSockets?", "options": ["Real-time full-duplex", "One-way", "Slow", "Offline"], "correct": 0, "exp": "Persistent connection." },
      { "q": "Docker Containers?", "options": ["Isolated environments", "Virtual Machines", "Folders", "Zips"], "correct": 0, "exp": "Package app with dependencies." },
      { "q": "CI/CD?", "options": ["Continuous Integration/Deployment", "Code Input/Code Delete", "Cloud In/Cloud Down", "None"], "correct": 0, "exp": "Automated delivery pipeline." },
      { "q": "OIDC vs OAuth2?", "options": ["AuthN vs AuthZ", "Same", "Speed", "Price"], "correct": 0, "exp": "Identity vs Access." },
    ],
  },
  "DevOps": {
    "easy": [
      { "q": "What is DevOps?", "options": ["Dev + Ops collaboration", "A tool", "A language", "A server"], "correct": 0, "exp": "Culture of collaboration." },
      { "q": "Git commands?", "options": ["commit, push, pull", "save, load, run", "start, stop, pause", "cut, copy, paste"], "correct": 0, "exp": "Version control ops." },
      { "q": "What is CI?", "options": ["Continuous Integration", "Code Input", "Cloud Interface", "Committed Index"], "correct": 0, "exp": "Merging code frequently." },
      { "q": "Linux command `ls`?", "options": ["List files", "Lost system", "Link server", "Load script"], "correct": 0, "exp": "Lists directory contents." },
      { "q": "What is a Server?", "options": ["Computer providing services", "Waiter", "Internet", "Screen"], "correct": 0, "exp": "Host for applications." },
    ],
    "medium": [
      { "q": "Docker vs VM?", "options": ["Container vs Full OS", "Same", "Free vs Paid", "Fast vs Slow"], "correct": 0, "exp": "Docker shares OS kernel." },
      { "q": "Jenkins is for?", "options": ["Automation Server", "Database", "Editor", "Browser"], "correct": 0, "exp": "CI/CD tool." },
      { "q": "Ansible uses?", "options": ["Playbooks (YAML)", "Scripts (Bash)", "Java", "C++"], "correct": 0, "exp": "Config management." },
      { "q": "Kubernetes Pod?", "options": ["Smallest deployable unit", "A server", "A cluster", "A disk"], "correct": 0, "exp": "Wraps containers." },
      { "q": "Infrastructure as Code?", "options": ["Managing infra via code", "Coding on server", "Hard coding", "None"], "correct": 0, "exp": "Terraform, Ansible, etc." },
    ],
    "hard": [
      { "q": "Kubernetes Service?", "options": ["Network abstraction", "A worker", "A master", "A disk"], "correct": 0, "exp": "Exposes Pods." },
      { "q": "Blue-Green Deployment?", "options": ["Zero downtime switch", "Color theme", "Testing UI", "Slow rollout"], "correct": 0, "exp": "Two identical environments." },
      { "q": "What is Prometheus?", "options": ["Monitoring tool", "Database", "CI tool", "Web server"], "correct": 0, "exp": "Time-series DB for metrics." },
      { "q": "GitOps?", "options": ["Git as source of truth", "GitHub Ops", "Git optimize", "None"], "correct": 0, "exp": "Ops workflow using Git." },
      { "q": "Terraform State?", "options": ["Mapping of resources", "US State", "Status", "Log"], "correct": 0, "exp": "Tracks real-world resources." },
    ],
  },
  "React Native": {
    "easy": [
      { "q": "React Native uses?", "options": ["React & Native Components", "HTML & CSS", "Java only", "Swift only"], "correct": 0, "exp": "Builds mobile apps." },
      { "q": "View tag equivalent?", "options": ["div", "span", "p", "img"], "correct": 0, "exp": "Basic container." },
      { "q": "Text tag?", "options": ["Renders text", "Input", "Button", "Image"], "correct": 0, "exp": "Required for text nodes." },
      { "q": "Flexbox in RN?", "options": ["Main layout model", "Not supported", "Optional", "Only Grid"], "correct": 0, "exp": "Defaults to column direction." },
      { "q": "Platform module?", "options": ["Detects OS (iOS/Android)", "Detects browser", "Detects screen", "None"], "correct": 0, "exp": "Platform specific code." },
    ],
    "medium": [
      { "q": "ScrollView vs FlatList?", "options": ["All vs Lazy load", "Same", "Horizontal vs Vertical", "None"], "correct": 0, "exp": "FlatList optimizes long lists." },
      { "q": "StyleSheet.create?", "options": ["Optimizes styles", "Creates CSS file", "Imports CSS", "None"], "correct": 0, "exp": "Performance optimization." },
      { "q": "AsyncStorage?", "options": ["Local key-value storage", "Cloud DB", "SQL DB", "Cache"], "correct": 0, "exp": "Unencrypted, asynchronous." },
      { "q": "Navigation?", "options": ["React Navigation", "Router DOM", "Link tag", "Href"], "correct": 0, "exp": "Library for screens." },
      { "q": "What is Expo?", "options": ["Framework/Toolchain", "A component", "A database", "A server"], "correct": 0, "exp": "Simplifies RN development." },
    ],
    "hard": [
      { "q": "Bridge in RN?", "options": ["JS/Native communication", "Network bridge", "UI bridge", "None"], "correct": 0, "exp": "Async serialization." },
      { "q": "JSI (JavaScript Interface)?", "options": ["Direct C++ calls", "Java Interface", "JSON Format", "Old Bridge"], "correct": 0, "exp": "Faster than Bridge." },
      { "q": "Native Modules?", "options": ["Platform specific native code", "JS modules", "npm packages", "CSS modules"], "correct": 0, "exp": "Access native APIs." },
      { "q": "Hermes Engine?", "options": ["Optimized JS engine", "Game engine", "Physics engine", "Render engine"], "correct": 0, "exp": "Improves startup time." },
      { "q": "Animated API?", "options": ["Declarative animations", "Video player", "GIF maker", "Canvas"], "correct": 0, "exp": "Fluid motion." },
    ],
  },
  "Blockchain": {
    "easy": [
      { "q": "What is Blockchain?", "options": ["Distributed Ledger Technology", "Centralized Database", "Cloud Storage", "Currency"], "correct": 0, "exp": "Decentralized record keeping." },
      { "q": "What is a Block?", "options": ["Container for data", "A brick", "A file", "A virus"], "correct": 0, "exp": "Stores transaction data." },
      { "q": "Bitcoin creator?", "options": ["Satoshi Nakamoto", "Vitalik Buterin", "Elon Musk", "Bill Gates"], "correct": 0, "exp": "Pseudonymous creator." },
      { "q": "What is Mining?", "options": ["Validating transactions", "Digging gold", "Creating files", "Hacking"], "correct": 0, "exp": "Process of adding blocks." },
      { "q": "Wallet address?", "options": ["Public key", "Private key", "Password", "Email"], "correct": 0, "exp": "Used to receive funds." },
    ],
    "medium": [
      { "q": "Proof of Work?", "options": ["Consensus algorithm", "Job certificate", "ID card", "Login"], "correct": 0, "exp": "Requires computational difficulty." },
      { "q": "Smart Contract?", "options": ["Self-executing code", "Legal paper", "Digital signature", "Payment"], "correct": 0, "exp": "Runs on blockchain automatically." },
      { "q": "DeFi stands for?", "options": ["Decentralized Finance", "Digital Finance", "Data Finance", "Direct Fund"], "correct": 0, "exp": "Finance without intermediaries." },
      { "q": "Ethereum token standard?", "options": ["ERC-20", "HTTP", "ISO", "TCP"], "correct": 0, "exp": "Standard for tokens." },
      { "q": "Hash function?", "options": ["One-way encryption", "Two-way", "Sorting", "Compression"], "correct": 0, "exp": "Maps data to fixed size." },
    ],
    "hard": [
      { "q": "51% Attack?", "options": ["Majority control of network", "Hacking 51 servers", "Price drop", "Fork"], "correct": 0, "exp": "Attacker controls mining power." },
      { "q": "Byzantine Generals Problem?", "options": ["Consensus issue", "War strategy", "Hardware failure", "Routing"], "correct": 0, "exp": "Reaching agreement in unreliable system." },
      { "q": "Lightning Network?", "options": ["Layer 2 solution", "New coin", "Cloud", "Wallet"], "correct": 0, "exp": "Faster Bitcoin transactions." },
      { "q": "Solidity?", "options": ["Smart contract language", "Database", "Protocol", "Wallet"], "correct": 0, "exp": "Language for Ethereum." },
      { "q": "DAO?", "options": ["Decentralized Autonomous Org", "Data Access Obj", "Digital Asset Org", "Domain Admin"], "correct": 0, "exp": "Org run by code." },
    ],
  }
}

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
                # Create a document in "interview_questions" collection
                doc_ref = db.collection("interview_questions").document()
                
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
    print(f"Seeding Complete! Total migrated: {count}") # Changed print message and used 'count'
    with open("seed_log.txt", "w") as f:
        f.write(f"Seeding Complete! Total migrated: {count}\n") # Used 'count'
    
if __name__ == "__main__":
    try:
        seed_questions() # Call the renamed function
    except Exception as e:
        with open("seed_log.txt", "w") as f:
            f.write(f"Error: {e}")
