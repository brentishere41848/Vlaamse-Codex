const lessons = {
  easy: [
    {
      id: 1,
      title: "Hello World",
      description: "Learn to print your first message",
      tags: ["basics", "print"],
      content: {
        introduction: "Welcome to your first Platskript lesson! Let's start by printing a simple message.",
        explanation: "In Platskript, we use <code>klap</code> to print text to the screen. Every program starts with <code>plan doe</code> and ends with <code>gedaan</code>. Each statement ends with <code>amen</code>.",
        example: `# coding: vlaamsplats
plan doe
  klap tekst gdag aan weeireld amen
gedaan`,
        explanation2: "This will print: <code>gdag aan weeireld</code>",
        challenge: "Try changing the message to print your name!",
        output: "gdag aan weeireld"
      }
    },
    {
      id: 2,
      title: "Variables",
      description: "Store and use values",
      tags: ["basics", "variables"],
      content: {
        introduction: "Variables let you store values for later use.",
        explanation: "In Platskript, we use <code>zet</code> to create variables. The syntax is <code>zet &lt;name&gt; op &lt;value&gt; amen</code>.",
        example: `# coding: vlaamsplats
plan doe
  zet naam op tekst Brent amen
  klap tekst gdag aan plakt spatie plakt da naam amen
gedaan`,
        explanation2: "This stores 'Brent' in a variable and uses it in the message.",
        challenge: "Create a variable with your favorite color and print it!",
        output: "gdag aan Brent"
      }
    },
    {
      id: 3,
      title: "Numbers",
      description: "Work with numeric values",
      tags: ["basics", "numbers"],
      content: {
        introduction: "Learn to use and display numbers.",
        explanation: "Use <code>getal</code> for numeric values. You can do math operations too!",
        example: `# coding: vlaamsplats
plan doe
  zet getal1 op getal 10 amen
  zet getal2 op getal 20 amen
  klap tekst getal1 is plakt spatie plakt da getal1 amen
  zet som op da getal1 plus da getal2 amen
  klap tekst som is plakt spatie plakt da som amen
gedaan`,
        explanation2: "Platskript uses <code>plus</code>, <code>min</code>, <code>keer</code>, <code>gedeeld</code> for math.",
        challenge: "Create variables for two numbers and multiply them!",
        output: "getal1 is 10\nsom is 30"
      }
    },
    {
      id: 4,
      title: "String Concatenation",
      description: "Join text together",
      tags: ["basics", "strings"],
      content: {
        introduction: "Combine multiple pieces of text.",
        explanation: "Use <code>plakt</code> to join text pieces together with <code>spatie</code> for spaces.",
        example: `# coding: vlaamsplats
plan doe
  zet voornaam op tekst Jan amen
  zet achternaam op tekst Peeters amen
  zet volledige_naam op da voornaam plakt spatie plakt da achternaam amen
  klap da volledige_naam amen
gedaan`,
        explanation2: "The <code>plakt</code> operator joins text together.",
        challenge: "Combine your first and last name!",
        output: "Jan Peeters"
      }
    },
    {
      id: 5,
      title: "Multiple Prints",
      description: "Print multiple lines",
      tags: ["basics", "print"],
      content: {
        introduction: "Print multiple messages to build output.",
        explanation: "Use multiple <code>klap</code> statements to print different lines.",
        example: `# coding: vlaamsplats
plan doe
  klap tekst lijn 1 amen
  klap tekst lijn 2 amen
  klap tekst lijn 3 amen
gedaan`,
        explanation2: "Each <code>klap</code> statement prints on a new line.",
        challenge: "Print a list of your 3 favorite foods!",
        output: "lijn 1\nlijn 2\nlijn 3"
      }
    },
    {
      id: 6,
      title: "Basic Math",
      description: "Arithmetic operations",
      tags: ["basics", "math"],
      content: {
        introduction: "Perform basic arithmetic.",
        explanation: "Use <code>plus</code> (+), <code>min</code> (-), <code>keer</code> (*), <code>gedeeld</code> (/).",
        example: `# coding: vlaamsplats
plan doe
  zet a op getal 15 amen
  zet b op getal 3 amen
  klap tekst plus: plakt spatie plakt da a plus spatie plakt da b amen
  klap tekst min: plakt spatie plakt da a min spatie plakt da b amen
  klap tekst keer: plakt spatie plakt da a keer spatie plakt da b amen
  klap tekst gedeeld: plakt spatie plakt da a gedeeld spatie plakt da b amen
  gedaan`,
        explanation2: "All basic operations work just like in math!",
        challenge: "Calculate 100 divided by 4!",
        output: "plus: 18\nmin: 12\nkeer: 45\ngedeeld: 5",
        challengeIcon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="6" x2="12" y2="2"></line><line x1="6" y1="6" x2="18" y2="6"></line><line x1="6" y1="6" x2="6" y2="18"></line><line x1="18" y1="6" x2="18" y2="18"></line></svg>`
      }
    },
    {
      id: 7,
      title: "If Statements",
      description: "Make decisions in code",
      tags: ["basics", "conditions"],
      content: {
        introduction: "Make your code make decisions.",
        explanation: "Use <code>als</code> for if conditions. Syntax: <code>als &lt;condition&gt; doe ... gedaan</code>.",
        example: `# coding: vlaamsplats
plan doe
  zet leeftijd op getal 18 amen
  als da leeftijd groter gelijk dan getal 18 doe
    klap tekst je bent volwassen amen
  gedaan
gedaan`,
        explanation2: "The code inside <code>als ... gedaan</code> only runs if the condition is true.",
        challenge: "Check if a number is greater than 10!",
        output: "je bent volwassen"
      }
    },
    {
      id: 8,
      title: "If Else",
      description: "Two-way decisions",
      tags: ["basics", "conditions"],
      content: {
        introduction: "Handle both true and false cases.",
        explanation: "Add <code>anders</code> for the false case.",
        example: `# coding: vlaamsplats
plan doe
  zet score op getal 75 amen
  als da score groter dan getal 50 doe
    klap tekst gefeliciteerd amen
  anders
    klap tekst probeer opnieuw amen
  gedaan
gedaan`,
        explanation2: "<code>anders</code> runs when the <code>als</code> condition is false.",
        challenge: "Check if temperature is above 20!",
        output: "gefeliciteerd"
      }
    },
    {
      id: 9,
      title: "Functions",
      description: "Create reusable code blocks",
      tags: ["basics", "functions"],
      content: {
        introduction: "Define and use functions.",
        explanation: "Use <code>maak funksie</code> to create functions. Syntax: <code>maak funksie &lt;name&gt; met &lt;params&gt; doe ... gedaan</code>",
        example: `# coding: vlaamsplats
plan doe
  maak funksie groet met naam doe
    klap tekst gdag plakt spatie plakt da naam amen
  gedaan

  roep groet met da Piet amen
  roep groet met da Anna amen
gedaan`,
        explanation2: "Functions let you reuse code. Use <code>roep</code> to call them.",
        challenge: "Create a function that says goodbye!",
        output: "gdag Piet\ngdag Anna"
      }
    },
    {
      id: 10,
      title: "Functions with Multiple Parameters",
      description: "Functions with multiple inputs",
      tags: ["basics", "functions"],
      content: {
        introduction: "Functions can take multiple parameters.",
        explanation: "Separate parameters with commas: <code>maak funksie &lt;name&gt; met &lt;param1&gt; &lt;param2&gt; doe</code>",
        example: `# coding: vlaamsplats
plan doe
  maak funksie telop met a b doe
    zet som op da a plus da b amen
    klap da som amen
  gedaan

  roep telop met getal 5 getal 10 amen
gedaan`,
        explanation2: "You can use any number of parameters in your functions.",
        challenge: "Create a function that multiplies two numbers!",
        output: "15"
      }
    },
    {
      id: 11,
      title: "Return Values",
      description: "Get values back from functions",
      tags: ["basics", "functions"],
      content: {
        introduction: "Functions can return values.",
        explanation: "Use <code>geeftterug</code> to return a value from a function.",
        example: `# coding: vlaamsplats
plan doe
  maak funksie verdubbel met waarde doe
    geeftterug da waarde keer getal 2 amen
  gedaan

  zet resultaat op roep verdubbel met getal 7 amen
  klap tekst verdubbeld: plakt spatie plakt da resultaat amen
gedaan`,
        explanation2: "<code>geeftterug</code> sends a value back to the caller.",
        challenge: "Create a function that returns a value plus 10!",
        output: "verdubbeld: 14"
      }
    },
    {
      id: 12,
      title: "Comments",
      description: "Add notes to your code",
      tags: ["basics", "documentation"],
      content: {
        introduction: "Document your code with comments.",
        explanation: "Use <code>#</code> for single line comments. They are ignored by the compiler.",
        example: `# coding: vlaamsplats
# Dit is een commentaar
plan doe
  # Zet de naam
  zet naam op tekst Test amen
  # Print de naam
  klap da naam amen
gedaan`,
        explanation2: "Comments help explain your code. Use them liberally!",
        challenge: "Add comments to explain what your code does!",
        output: "Test"
      }
    },
    {
      id: 13,
      title: "While Loops",
      description: "Repeat code while condition is true",
      tags: ["basics", "loops"],
      content: {
        introduction: "Repeat code blocks.",
        explanation: "Use <code>zolang</code> to create loops that run while a condition is true.",
        example: `# coding: vlaamsplats
plan doe
  zet teller op getal 1 amen
  zolang da teller kleiner dan getal 4 doe
    klap da teller amen
    zet teller op da teller plus getal 1 amen
  gedaan
gedaan`,
        explanation2: "Be careful with loops - make sure the condition becomes false eventually!",
        challenge: "Print numbers 1 to 5!",
        output: "1\n2\n3"
      }
    },
    {
      id: 14,
      title: "For Loops (Range)",
      description: "Loop through a range",
      tags: ["basics", "loops"],
      content: {
        introduction: "Loop a specific number of times.",
        explanation: "Use <code>voor elke</code> with a range to loop through numbers.",
        example: `# coding: vlaamsplats
plan doe
  voor elke i in bereik 1 4 doe
    klap tekst nummer: plakt spatie plakt da i amen
  gedaan
gedaan`,
        explanation2: "<code>bereik start stop</code> creates a range from start to stop-1.",
        challenge: "Print numbers 10 to 15!",
        output: "nummer: 1\nnummer: 2\nnummer: 3"
      }
    },
    {
      id: 15,
      title: "String Length",
      description: "Get the length of text",
      tags: ["basics", "strings"],
      content: {
        introduction: "Find out how long a string is.",
        explanation: "Use <code>lengte van</code> to get the length of a string.",
        example: `# coding: vlaamsplats
plan doe
  zet tekst op tekst hallo amen
  zet len op lengte van da tekst amen
  klap tekst de lengte is: plakt spatie plakt da len amen
gedaan`,
        explanation2: "This returns the number of characters in the string.",
        challenge: "Find the length of your name!",
        output: "de lengte is: 5"
      }
    },
    {
      id: 16,
      title: "String to Uppercase",
      description: "Convert text to uppercase",
      tags: ["basics", "strings"],
      content: {
        introduction: "Make text all uppercase.",
        explanation: "Use <code>hoofdletters van</code> to convert a string to uppercase.",
        example: `# coding: vlaamsplats
plan doe
  zet tekst op tekst hallo amen
  zet hoofd op hoofdletters van da tekst amen
  klap tekst origineel: plakt spatie plakt da tekst amen
  klap tekst hoofdletters: plakt spatie plakt da hoofd amen
gedaan`,
        explanation2: "This is useful for formatting text consistently.",
        challenge: "Convert 'hello world' to uppercase!",
        output: "origineel: hallo\nhoofdletters: HALLO"
      }
    },
    {
      id: 17,
      title: "String to Lowercase",
      description: "Convert text to lowercase",
      tags: ["basics", "strings"],
      content: {
        introduction: "Make text all lowercase.",
        explanation: "Use <code>kleineletters van</code> to convert a string to lowercase.",
        example: `# coding: vlaamsplats
plan doe
  zet tekst op tekst HALLO WERELD amen
  zet klein op kleineletters van da tekst amen
  klap tekst kleineletters: plakt spatie plakt da klein amen
gedaan`,
        explanation2: "Great for normalizing user input.",
        challenge: "Convert 'HELLO' to lowercase!",
        output: "kleineletters: hallo wereld"
      }
    },
    {
      id: 18,
      title: "Lists - Basic",
      description: "Store multiple values",
      tags: ["basics", "lists"],
      content: {
        introduction: "Create and use lists of values.",
        explanation: "Use <code>lijst</code> to create a list of values.",
        example: `# coding: vlaamsplats
plan doe
  zet namen op lijst tekst Jan tekst Piet tekst Anna amen
  klap tekst namen: plakt spatie plakt da namen amen
gedaan`,
        explanation2: "Lists can hold multiple values of any type.",
        challenge: "Create a list of your favorite colors!",
        output: "namen: ['Jan', 'Piet', 'Anna']"
      }
    },
    {
      id: 19,
      title: "List Length",
      description: "Count items in a list",
      tags: ["basics", "lists"],
      content: {
        introduction: "Find how many items are in a list.",
        explanation: "Use <code>lengte van</code> on a list to count its items.",
        example: `# coding: vlaamsplats
plan doe
  zet items op lijst getal 1 getal 2 getal 3 getal 4 getal 5 amen
  zet count op lengte van da items amen
  klap tekst aantal items: plakt spatie plakt da count amen
gedaan`,
        explanation2: "This returns the number of items in the list.",
        challenge: "Create a list and count its items!",
        output: "aantal items: 5"
      }
    },
    {
      id: 20,
      title: "Accessing List Items",
      description: "Get specific items from lists",
      tags: ["basics", "lists"],
      content: {
        introduction: "Access individual items in a list.",
        explanation: "Use <code>index &lt;number&gt; van</code> to access a specific item. Indexing starts at 0.",
        example: `# coding: vlaamsplats
plan doe
  zet kleuren op lijst tekst rood tekst blauw tekst groen amen
  zet eerste op index getal 0 van da kleuren amen
  zet tweede op index getal 1 van da kleuren amen
  klap tekst eerste: plakt spatie plakt da eerste amen
  klap tekst tweede: plakt spatie plakt da tweede amen
gedaan`,
        explanation2: "Remember: list indices start at 0, not 1!",
        challenge: "Get the third item from a list of 5 items!",
        output: "eerste: rood\ntweede: blauw"
      }
    },
    {
      id: 21,
      title: "Boolean Values",
      description: "True and false values",
      tags: ["basics", "booleans"],
      content: {
        introduction: "Understand true and false.",
        explanation: "Use <code>waar</code> (true) and <code>onwaar</code> (false) for boolean values.",
        example: `# coding: vlaamsplats
plan doe
  zet is_geldig op waar amen
  zet is_fout op onwaar amen
  als da is_geldig doe
    klap tekst het is waar amen
  gedaan
gedaan`,
        explanation2: "Booleans are used for conditions and logic.",
        challenge: "Create a boolean variable and check it!",
        output: "het is waar"
      }
    },
    {
      id: 22,
      title: "Comparison Operators",
      description: "Compare values",
      tags: ["basics", "conditions"],
      content: {
        introduction: "Use comparison operators.",
        explanation: "Operators: <code>groter dan</code> (>), <code>kleiner dan</code> (<), <code>gelijk aan</code> (==), <code>niet gelijk</code> (!=).",
        example: `# coding: vlaamsplats
plan doe
  zet a op getal 10 amen
  zet b op getal 20 amen
  als da a kleiner dan da b doe
    klap tekst a is kleiner dan b amen
  gedaan
  als da a niet gelijk aan da b doe
    klap tekst a is niet gelijk aan b amen
  gedaan
gedaan`,
        explanation2: "Comparison operators return true or false.",
        challenge: "Check if two numbers are equal!",
        output: "a is kleiner dan b\na is niet gelijk aan b"
      }
    }
  ],
  medium: [
    {
      id: 23,
      title: "Else If",
      description: "Multiple condition branches",
      tags: ["conditions", "control-flow"],
      content: {
        introduction: "Handle multiple conditions.",
        explanation: "Use <code>anders als</code> to add more conditions.",
        example: `# coding: vlaamsplats
plan doe
  zet score op getal 75 amen
  als da score groter gelijk dan getal 90 doe
    klap tekst uitstekend amen
  anders als da score groter gelijk dan getal 70 doe
    klap tekst goed amen
  anders als da score groter gelijk dan getal 60 doe
    klap tekst voldoende amen
  anders
    klap tekst onvoldoende amen
  gedaan
gedaan`,
        explanation2: "<code>anders als</code> lets you check multiple conditions in sequence.",
        challenge: "Create a grade calculator with A, B, C, D, F!",
        output: "goed"
      }
    },
    {
      id: 24,
      title: "Nested Ifs",
      description: "If statements inside if statements",
      tags: ["conditions", "control-flow"],
      content: {
        introduction: "Put conditions inside conditions.",
        explanation: "You can nest <code>als</code> statements inside each other.",
        example: `# coding: vlaamsplats
plan doe
  zet leeftijd op getal 25 amen
  zet heeft_rijbewijs op waar amen
  als da leeftijd groter gelijk dan getal 18 doe
    als da heeft_rijbewijs doe
      klap tekst je mag rijden amen
    anders
      klap tekst je hebt een rijbewijs nodig amen
    gedaan
  anders
    klap tekst je bent nog te jong amen
  gedaan
gedaan`,
        explanation2: "Nested conditions let you check multiple related factors.",
        challenge: "Check if someone can enter a club (age + ID)!",
        output: "je mag rijden"
      }
    },
    {
      id: 25,
      title: "For Loops - Iterating Lists",
      description: "Loop through list items",
      tags: ["loops", "lists"],
      content: {
        introduction: "Process each item in a list.",
        explanation: "Use <code>voor elke</code> to loop through list items.",
        example: `# coding: vlaamsplats
plan doe
  zet namen op lijst tekst Jan tekst Piet tekst Anna amen
  voor elke naam in da namen doe
    klap tekst gdag plakt spatie plakt da naam amen
  gedaan
gedaan`,
        explanation2: "<code>voor elke item in lijst</code> processes each item.",
        challenge: "Print a greeting for each name in a list!",
        output: "gdag Jan\ngdag Piet\ngdag Anna"
      }
    },
    {
      id: 26,
      title: "Adding to Lists",
      description: "Add items to a list",
      tags: ["lists", "data-structures"],
      content: {
        introduction: "Dynamically add items to lists.",
        explanation: "Use <code>voeg ... toe aan</code> to add items.",
        example: `# coding: vlaamsplats
plan doe
  zet fruit op lijst tekst appel tekst banaan amen
  klap tekst voor: plakt spatie plakt da fruit amen
  voeg tekst sinaasappel toe aan da fruit amen
  klap tekst na: plakt spatie plakt da fruit amen
gedaan`,
        explanation2: "Lists are mutable - you can add items anytime!",
        challenge: "Build a shopping list dynamically!",
        output: "voor: ['appel', 'banaan']\nna: ['appel', 'banaan', 'sinaasappel']"
      }
    },
    {
      id: 27,
      title: "Removing from Lists",
      description: "Remove items from lists",
      tags: ["lists", "data-structures"],
      content: {
        introduction: "Remove items from lists.",
        explanation: "Use <code>verwijder ... uit</code> to remove items.",
        example: `# coding: vlaamsplats
plan doe
  zet taken op lijst tekst taak1 tekst taak2 tekst taak3 amen
  klap tekst voor: plakt spatie plakt da taken amen
  verwijder tekst taak2 uit da taken amen
  klap tekst na: plakt spatie plakt da taken amen
gedaan`,
        explanation2: "Remove items by value from lists.",
        challenge: "Remove completed tasks from a to-do list!",
        output: "voor: ['taak1', 'taak2', 'taak3']\nna: ['taak1', 'taak3']"
      }
    },
    {
      id: 28,
      title: "List Slicing",
      description: "Get a subset of a list",
      tags: ["lists", "data-structures"],
      content: {
        introduction: "Get part of a list.",
        explanation: "Use <code>deel van ... van ... tot</code> to slice lists.",
        example: `# coding: vlaamsplats
plan doe
  zet getallen op lijst getal 0 getal 1 getal 2 getal 3 getal 4 amen
  zet eerste_drie op deel van da getallen van getal 0 tot getal 3 amen
  klap tekst eerste drie: plakt spatie plakt da eerste_drie amen
gedaan`,
        explanation2: "Slicing gives you a portion of the list.",
        challenge: "Get the last 3 items from a list!",
        output: "eerste drie: [0, 1, 2]"
      }
    },
    {
      id: 29,
      title: "Dictionaries - Basic",
      description: "Key-value pairs",
      tags: ["data-structures", "dictionaries"],
      content: {
        introduction: "Store data with keys.",
        explanation: "Use <code>woordenboek</code> to create dictionaries.",
        example: `# coding: vlaamsplats
plan doe
  zet persoon op woordenboek tekst naam tekst Jan tekst leeftijd getal 25 amen
  klap tekst naam: plakt spatie plakt waarde tekst naam van da persoon amen
  klap tekst leeftijd: plakt spatie plakt waarde tekst leeftijd van da persoon amen
gedaan`,
        explanation2: "Dictionaries store data as key-value pairs.",
        challenge: "Create a dictionary with book info!",
        output: "naam: Jan\nleeftijd: 25"
      }
    },
    {
      id: 30,
      title: "Dictionary Access",
      description: "Get values by key",
      tags: ["data-structures", "dictionaries"],
      content: {
        introduction: "Access dictionary values.",
        explanation: "Use <code>wat tekst key van</code> or <code>wat waarde tekst key van</code> to get values.",
        example: `# coding: vlaamsplats
plan doe
  zet instellingen op woordenboek tekst taal tekst nl tekst thema tekst donker amen
  zet taal op wat tekst taal van da instellingen amen
  zet thema op wat tekst thema van da instellingen amen
  klap tekst taal: plakt spatie plakt da taal amen
  klap tekst thema: plakt spatie plakt da thema amen
gedaan`,
        explanation2: "Access dictionary values using their keys.",
        challenge: "Create a settings dictionary and access its values!",
        output: "taal: nl\nthema: donker"
      }
    },
    {
      id: 31,
      title: "Break Statements",
      description: "Exit loops early",
      tags: ["loops", "control-flow"],
      content: {
        introduction: "Stop a loop before it finishes.",
        explanation: "Use <code>stop</code> to exit a loop early.",
        example: `# coding: vlaamsplats
plan doe
  zolang waar doe
    zet nummer op getal 1 amen
    klap da nummer amen
    als da nummer groter dan getal 5 doe
      stop
    gedaan
    zet nummer op da nummer plus getal 1 amen
  gedaan
gedaan`,
        explanation2: "<code>stop</code> immediately exits the loop.",
        challenge: "Find the first number divisible by 7!",
        output: "1\n2\n3\n4\n5"
      }
    },
    {
      id: 32,
      title: "Continue Statements",
      description: "Skip to next iteration",
      tags: ["loops", "control-flow"],
      content: {
        introduction: "Skip the rest of the loop iteration.",
        explanation: "Use <code>doorgaan</code> to skip to the next iteration.",
        example: `# coding: vlaamsplats
plan doe
  voor elke i in bereik 1 6 doe
    als da i gelijk aan getal 3 doe
      doorgaan
    gedaan
    klap tekst nummer: plakt spatie plakt da i amen
  gedaan
gedaan`,
        explanation2: "<code>doorgaan</code> skips the current iteration.",
        challenge: "Print all odd numbers from 1 to 10!",
        output: "nummer: 1\nnummer: 2\nnummer: 4\nnummer: 5"
      }
    },
    {
      id: 33,
      title: "String Formatting",
      description: "Insert values into strings",
      tags: ["strings", "formatting"],
      content: {
        introduction: "Embed values in strings.",
        explanation: "Use <code>formaat</code> to create formatted strings.",
        example: `# coding: vlaamsplats
plan doe
  zet naam op tekst Jan amen
  zet leeftijd op getal 25 amen
  zet bericht op tekst hallo {naam}, je bent {leeftijd} jaar oud met naam da naam met leeftijd da leeftijd amen
  klap da bericht amen
gedaan`,
        explanation2: "Use <code>met key value</code> to substitute values.",
        challenge: "Format a welcome message!",
        output: "hallo Jan, je bent 25 jaar oud"
      }
    },
    {
      id: 34,
      title: "Try-Except Blocks",
      description: "Handle errors gracefully",
      tags: ["error-handling", "control-flow"],
      content: {
        introduction: "Catch and handle errors.",
        explanation: "Use <code>probeer</code> and <code>behalve</code> to handle errors.",
        example: `# coding: vlaamsplats
plan doe
  zet waarde op getal 10 amen
  probeer
    zet resultaat op da waarde gedeeld getal 0 amen
    klap da resultaat amen
  behalve
    klap tekst fout: kan niet delen door nul amen
  gedaan
gedaan`,
        explanation2: "<code>probeer ... behalve</code> catches errors and lets you handle them.",
        challenge: "Handle division by zero error!",
        output: "fout: kan niet delen door nul"
      }
    }
  ],
  hard: [
    {
      id: 35,
      title: "Recursive Functions",
      description: "Functions that call themselves",
      tags: ["advanced", "functions", "recursion"],
      content: {
        introduction: "Learn the power of recursion.",
        explanation: "A recursive function calls itself to solve problems by breaking them down.",
        example: `# coding: vlaamsplats
plan doe
  maak funksie faculteit met n doe
    als da n kleiner gelijk dan getal 1 doe
      geeftterug getal 1 amen
    gedaan
    geeftterug da n keer roep faculteit met da n min getal 1 amen
  gedaan

  zet resultaat op roep faculteit met getal 5 amen
  klap tekst 5! is: plakt spatie plakt da resultaat amen
gedaan`,
        explanation2: "Recursion is powerful but can cause infinite loops if not careful!",
        challenge: "Create a recursive function to calculate Fibonacci!",
        output: "5! is: 120"
      }
    },
    {
      id: 36,
      title: "List Comprehensions",
      description: "Create lists with expressions",
      tags: ["advanced", "lists", "functional"],
      content: {
        introduction: "Create lists elegantly.",
        explanation: "Use list comprehensions to create lists based on existing ones.",
        example: `# coding: vlaamsplats
plan doe
  zet getallen op lijst getal 1 getal 2 getal 3 getal 4 getal 5 amen
  zet kwadraten op lijst van da x keer da x voor elke x in da getallen amen
  klap tekst kwadraten: plakt spatie plakt da kwadraten amen
gedaan`,
        explanation2: "List comprehensions are concise and readable.",
        challenge: "Create a list of even numbers from 1 to 20!",
        output: "kwadraten: [1, 4, 9, 16, 25]"
      }
    },
    {
      id: 37,
      title: "Lambda Functions",
      description: "Anonymous functions",
      tags: ["advanced", "functions", "functional"],
      content: {
        introduction: "Create functions without names.",
        explanation: "Use <code>funksie</code> to create lambda-like anonymous functions.",
        example: `# coding: vlaamsplats
plan doe
  zet verdubbel op funksie x geef da x keer getal 2 einde amen
  zet resultaat op roep verdubbel met getal 7 amen
  klap tekst verdubbeld: plakt spatie plakt da resultaat amen
gedaan`,
        explanation2: "Anonymous functions are useful for short, one-time operations.",
        challenge: "Create a lambda that adds 5 to a number!",
        output: "verdubbeld: 14"
      }
    },
    {
      id: 38,
      title: "Generators",
      description: "Lazy iteration",
      tags: ["advanced", "iterators", "memory"],
      content: {
        introduction: "Generate values on demand.",
        explanation: "Generators yield values one at a time instead of all at once.",
        example: `# coding: vlaamsplats
plan doe
  maak funksie counter met start doe
    zolang waar doe
      geeftterug da start
      zet start op da start plus getal 1 amen
    gedaan
  gedaan

  zet gen op roep counter met getal 1 amen
  zet val1 op volgende van da gen amen
  zet val2 op volgende van da gen amen
  zet val3 op volgende van da gen amen
  klap tekst waarden: plakt spatie plakt da val1 plakt spatie plakt da val2 plakt spatie plakt da val3 amen
gedaan`,
        explanation2: "Generators are memory efficient for large datasets.",
        challenge: "Create a generator for Fibonacci numbers!",
        output: "waarden: 1 2 3"
      }
    },
    {
      id: 39,
      title: "Decorator Pattern",
      description: "Modify function behavior",
      tags: ["advanced", "functions", "patterns"],
      content: {
        introduction: "Add functionality to functions.",
        explanation: "Decorators wrap functions to add behavior.",
        example: `# coding: vlaamsplats
plan doe
  maak funksie timer met funksie f doe
    maak funksie wrapper doe
      zet start op get_tijd amen
      zet resultaat op roep f amen
      zet eind op get_tijd amen
      klap tekst duur: plakt spatie plakt da eind min da start amen
      geeftterug da resultaat amen
    gedaan
    geeftterug wrapper
  gedaan

  klap tekst test functie amen
gedaan`,
        explanation2: "Decorators let you modify function behavior without changing the function.",
        challenge: "Create a decorator that logs function calls!",
        output: "test functie"
      }
    }
  ]
};

let currentSection = 'easy';
let currentLesson = null;
let completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');

function initLearn() {
  renderLessons('easy');
  renderLessons('medium');
  renderLessons('hard');
  updateProgress();
  setupTabs();
  setupModal();
}

function renderLessons(section) {
  const container = document.getElementById(`${section}-lessons`);
  if (!container) return;

  const sectionLessons = lessons[section];
  container.innerHTML = sectionLessons.map(lesson => `
    <div class="lesson-card ${completedLessons.includes(lesson.id) ? 'completed' : ''}" data-id="${lesson.id}">
      <span class="lesson-number">${lesson.id}</span>
      <h3 class="lesson-title">${lesson.title}</h3>
      <p class="lesson-description">${lesson.description}</p>
      <div class="lesson-tags">
        ${lesson.tags.map(tag => `<span class="lesson-tag">${tag}</span>`).join('')}
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.lesson-card').forEach(card => {
    card.addEventListener('click', () => openLesson(parseInt(card.dataset.id)));
  });
}

function openLesson(id) {
  const lesson = Object.values(lessons).flat().find(l => l.id === id);
  if (!lesson) return;

  currentLesson = lesson;
  const modal = document.getElementById('lessonModal');
  const content = document.getElementById('lessonContent');

  content.innerHTML = `
    <span class="difficulty-badge ${currentSection}">${currentSection}</span>
    <h2 class="lesson-modal-title">${lesson.title}</h2>

    <div class="lesson-section">
      <h3>Introduction</h3>
      <p>${lesson.content.introduction}</p>
    </div>

    <div class="lesson-section">
      <h3>Explanation</h3>
      <p>${lesson.content.explanation}</p>
      <pre><code>${lesson.content.example}</code></pre>
    </div>

    ${lesson.content.explanation2 ? `
    <div class="lesson-section">
      <h3>How it Works</h3>
      <p>${lesson.content.explanation2}</p>
    </div>
    ` : ''}

    <div class="lesson-challenge">
      <h4>🎯 Challenge</h4>
      <p>${lesson.content.challenge}</p>
    </div>

    ${lesson.content.output ? `
    <div class="lesson-section">
      <h3>Expected Output</h3>
      <pre><code>${lesson.content.output}</code></pre>
    </div>
    ` : ''}
  `;

  document.getElementById('lessonCounter').textContent = `${lesson.id} / ${getSectionLessonCount()}`;
  updateNavButtons();

  modal.classList.add('active');
}

function getSectionLessonCount() {
  const sectionLessons = lessons[currentSection];
  return sectionLessons.length;
}

function updateNavButtons() {
  const sectionLessons = lessons[currentSection];
  const currentIndex = sectionLessons.findIndex(l => l.id === currentLesson.id);
  const prevBtn = document.getElementById('prevLesson');
  const nextBtn = document.getElementById('nextLesson');

  prevBtn.disabled = currentIndex === 0;
  nextBtn.textContent = currentIndex === sectionLessons.length - 1 ? 'Complete' : 'Next';
}

function setupTabs() {
  document.querySelectorAll('.section-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.section-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.section-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      currentSection = tab.dataset.section;
      document.getElementById(`section-${currentSection}`).classList.add('active');
    });
  });
}

function setupModal() {
  const modal = document.getElementById('lessonModal');
  const closeBtn = document.getElementById('modalClose');
  const prevBtn = document.getElementById('prevLesson');
  const nextBtn = document.getElementById('nextLesson');

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  prevBtn.addEventListener('click', () => navigateLesson(-1));
  nextBtn.addEventListener('click', () => {
    const sectionLessons = lessons[currentSection];
    const currentIndex = sectionLessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex === sectionLessons.length - 1) {
      completeLesson();
    } else {
      navigateLesson(1);
    }
  });
}

function closeModal() {
  document.getElementById('lessonModal').classList.remove('active');
  currentLesson = null;
}

function navigateLesson(direction) {
  const sectionLessons = lessons[currentSection];
  const currentIndex = sectionLessons.findIndex(l => l.id === currentLesson.id);
  const newIndex = currentIndex + direction;

  if (newIndex >= 0 && newIndex < sectionLessons.length) {
    openLesson(sectionLessons[newIndex].id);
  }
}

function completeLesson() {
  if (currentLesson && !completedLessons.includes(currentLesson.id)) {
    completedLessons.push(currentLesson.id);
    localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
    renderLessons(currentSection);
    updateProgress();

    if (window.VlaamsCodex && window.VlaamsCodex.showToast) {
      window.VlaamsCodex.showToast('Lesson completed! 🎉', 'success');
    }
  }
  closeModal();
}

function updateProgress() {
  const totalLessons = Object.values(lessons).flat().length;
  const progress = (completedLessons.length / totalLessons) * 100;

  document.getElementById('progressFill').style.width = `${progress}%`;
  document.getElementById('progressText').textContent = `${completedLessons.length} / ${totalLessons} lessons completed`;
}

document.addEventListener('DOMContentLoaded', initLearn);
