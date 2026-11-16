/**
 * Balance Quest — S.1 Linear Equations question bank.
 *
 * The 28 questions follow the order of "S.1 linear question.docx" (Teaching Examples 4.1–4.10).
 * Each question has 3 similar questions ("sims"). A student who makes a mistake on a question
 * is given ONE of its similar questions straight afterwards.
 *
 * Step format: [operation, argument, line after the step, options?]
 *   "add" / "sub"  argument = the term added to / subtracted from both sides   e.g. ["sub", "8", "x = −6"]
 *   "mul" / "div"  argument = the number both sides are multiplied / divided by e.g. ["div", "−5", "y = −4"]
 *   "expand"       argument = the move text shown to students (expanding brackets)
 *   "combine"      argument = the move text shown to students (collecting like terms)
 *   options (optional) = { hint: "...", wrong: ["wrong move 1", "wrong move 2"] }
 * "alt" (optional) = another accepted way to begin the question, with its own steps.
 *
 * Write "−" or "-" for minus, "/" for fractions, ( ) or [ ] for brackets.
 */
var QUESTION_BANK = [
  // ───────────── Teaching Example 4.1 ─────────────
  { id: "4.1a", example: "4.1", part: "a", type: "One-step · addition", eq: "x + 8 = 2",
    steps: [["sub", "8", "x = −6"]],
    sims: [
      { eq: "x + 5 = −3", steps: [["sub", "5", "x = −8"]] },
      { eq: "y + 13 = 4", steps: [["sub", "13", "y = −9"]] },
      { eq: "a + 7 = 11", steps: [["sub", "7", "a = 4"]] }
    ] },
  { id: "4.1b", example: "4.1", part: "b", type: "One-step · subtraction", eq: "x − 11 = −3",
    steps: [["add", "11", "x = 8"]],
    sims: [
      { eq: "x − 9 = −4", steps: [["add", "9", "x = 5"]] },
      { eq: "p − 7 = −12", steps: [["add", "7", "p = −5"]] },
      { eq: "k − 15 = −6", steps: [["add", "15", "k = 9"]] }
    ] },
  { id: "4.1c", example: "4.1", part: "c", type: "One-step · negative coefficient", eq: "−5y = 20",
    steps: [["div", "−5", "y = −4"]],
    sims: [
      { eq: "−4y = 28", steps: [["div", "−4", "y = −7"]] },
      { eq: "−6n = −42", steps: [["div", "−6", "n = 7"]] },
      { eq: "−3x = 27", steps: [["div", "−3", "x = −9"]] }
    ] },
  { id: "4.1d", example: "4.1", part: "d", type: "One-step · division", eq: "y/3 = −7",
    steps: [["mul", "3", "y = −21"]],
    sims: [
      { eq: "x/4 = −5", steps: [["mul", "4", "x = −20"]] },
      { eq: "a/6 = 3", steps: [["mul", "6", "a = 18"]] },
      { eq: "m/5 = −8", steps: [["mul", "5", "m = −40"]] }
    ] },

  // ───────────── Teaching Example 4.2 ─────────────
  { id: "4.2a", example: "4.2", part: "a", type: "Two-step · addition", eq: "2x + 13 = 5",
    steps: [["sub", "13", "2x = −8"], ["div", "2", "x = −4"]],
    sims: [
      { eq: "3x + 11 = 2", steps: [["sub", "11", "3x = −9"], ["div", "3", "x = −3"]] },
      { eq: "4y + 15 = 7", steps: [["sub", "15", "4y = −8"], ["div", "4", "y = −2"]] },
      { eq: "5a + 9 = 24", steps: [["sub", "9", "5a = 15"], ["div", "5", "a = 3"]] }
    ] },
  { id: "4.2b", example: "4.2", part: "b", type: "Two-step · subtraction", eq: "5x − 2 = −12",
    steps: [["add", "2", "5x = −10"], ["div", "5", "x = −2"]],
    sims: [
      { eq: "3x − 4 = −19", steps: [["add", "4", "3x = −15"], ["div", "3", "x = −5"]] },
      { eq: "6y − 5 = −29", steps: [["add", "5", "6y = −24"], ["div", "6", "y = −4"]] },
      { eq: "7k − 3 = 11", steps: [["add", "3", "7k = 14"], ["div", "7", "k = 2"]] }
    ] },
  { id: "4.2c", example: "4.2", part: "c", type: "Two-step · negative coefficient", eq: "−4y + 3 = −1",
    steps: [["sub", "3", "−4y = −4"], ["div", "−4", "y = 1"]],
    sims: [
      { eq: "−3y + 5 = −10", steps: [["sub", "5", "−3y = −15"], ["div", "−3", "y = 5"]] },
      { eq: "−6x + 7 = 19", steps: [["sub", "7", "−6x = 12"], ["div", "−6", "x = −2"]] },
      { eq: "−2m + 9 = 1", steps: [["sub", "9", "−2m = −8"], ["div", "−2", "m = 4"]] }
    ] },
  { id: "4.2d", example: "4.2", part: "d", type: "Two-step · unknown on the right", eq: "4 = 10 − 3y",
    steps: [["add", "3y", "4 + 3y = 10"], ["sub", "4", "3y = 6"], ["div", "3", "y = 2"]],
    sims: [
      { eq: "1 = 9 − 2y", steps: [["add", "2y", "1 + 2y = 9"], ["sub", "1", "2y = 8"], ["div", "2", "y = 4"]] },
      { eq: "3 = 15 − 4x", steps: [["add", "4x", "3 + 4x = 15"], ["sub", "3", "4x = 12"], ["div", "4", "x = 3"]] },
      { eq: "16 = 4 − 3m", steps: [["add", "3m", "16 + 3m = 4"], ["sub", "16", "3m = −12"], ["div", "3", "m = −4"]] }
    ] },

  // ───────────── Teaching Example 4.3 ─────────────
  { id: "4.3a", example: "4.3", part: "a", type: "Fractions · bracket in the numerator", eq: "(x + 3)/2 = −4",
    steps: [["mul", "2", "x + 3 = −8"], ["sub", "3", "x = −11"]],
    sims: [
      { eq: "(x + 5)/3 = −4", steps: [["mul", "3", "x + 5 = −12"], ["sub", "5", "x = −17"]] },
      { eq: "(y − 4)/5 = 2", steps: [["mul", "5", "y − 4 = 10"], ["add", "4", "y = 14"]] },
      { eq: "(k − 6)/2 = −5", steps: [["mul", "2", "k − 6 = −10"], ["add", "6", "k = −4"]] }
    ] },
  { id: "4.3b", example: "4.3", part: "b", type: "Brackets · negative number outside", eq: "−4(y − 3) = 24",
    steps: [["expand", "Expand the bracket on the left side", "−4y + 12 = 24", { hint: "Multiply both terms inside the bracket by −4: (−4) × y and (−4) × (−3). Keep the right side unchanged.", wrong: ["Multiply only y by −4", "Expand the bracket as −4y − 12"] }],
            ["sub", "12", "−4y = 12"], ["div", "−4", "y = −3"]],
    alt: { steps: [["div", "−4", "y − 3 = −6", { hint: "Dividing the whole left side by −4 removes the number outside the bracket." }], ["add", "3", "y = −3"]] },
    sims: [
      { eq: "−3(y − 5) = 21",
        steps: [["expand", "Expand the bracket on the left side", "−3y + 15 = 21", { hint: "Multiply both terms inside the bracket by −3: (−3) × y and (−3) × (−5).", wrong: ["Multiply only y by −3", "Expand the bracket as −3y − 15"] }],
                ["sub", "15", "−3y = 6"], ["div", "−3", "y = −2"]],
        alt: { steps: [["div", "−3", "y − 5 = −7"], ["add", "5", "y = −2"]] } },
      { eq: "−5(x − 2) = 30",
        steps: [["expand", "Expand the bracket on the left side", "−5x + 10 = 30", { hint: "Multiply both terms inside the bracket by −5: (−5) × x and (−5) × (−2).", wrong: ["Multiply only x by −5", "Expand the bracket as −5x − 10"] }],
                ["sub", "10", "−5x = 20"], ["div", "−5", "x = −4"]],
        alt: { steps: [["div", "−5", "x − 2 = −6"], ["add", "2", "x = −4"]] } },
      { eq: "−2(m + 4) = 6",
        steps: [["expand", "Expand the bracket on the left side", "−2m − 8 = 6", { hint: "Multiply both terms inside the bracket by −2: (−2) × m and (−2) × 4.", wrong: ["Multiply only m by −2", "Expand the bracket as −2m + 8"] }],
                ["add", "8", "−2m = 14"], ["div", "−2", "m = −7"]],
        alt: { steps: [["div", "−2", "m + 4 = −3"], ["sub", "4", "m = −7"]] } }
    ] },
  { id: "4.3c", example: "4.3", part: "c", type: "Fractions · fraction term", eq: "8 − 3z/4 = 2",
    steps: [["sub", "8", "−3z/4 = −6"], ["mul", "4", "−3z = −24"], ["div", "−3", "z = 8"]],
    sims: [
      { eq: "9 − 2x/5 = 3", steps: [["sub", "9", "−2x/5 = −6"], ["mul", "5", "−2x = −30"], ["div", "−2", "x = 15"]] },
      { eq: "5 − 3y/2 = 11", steps: [["sub", "5", "−3y/2 = 6"], ["mul", "2", "−3y = 12"], ["div", "−3", "y = −4"]] },
      { eq: "4 − 5a/3 = −6", steps: [["sub", "4", "−5a/3 = −10"], ["mul", "3", "−5a = −30"], ["div", "−5", "a = 6"]] }
    ] },

  // ───────────── Teaching Example 4.3 (Extra) ─────────────
  { id: "4.3Ea", example: "4.3 (Extra)", part: "a", type: "Fractions on both sides", eq: "(2 − x)/3 = 1/2",
    steps: [["mul", "6", "2(2 − x) = 3"], ["expand", "Expand the bracket on the left side", "4 − 2x = 3"],
            ["sub", "4", "−2x = −1"], ["div", "−2", "x = 1/2"]],
    sims: [
      { eq: "(3 − x)/4 = 1/3", steps: [["mul", "12", "3(3 − x) = 4"], ["expand", "Expand the bracket on the left side", "9 − 3x = 4"], ["sub", "9", "−3x = −5"], ["div", "−3", "x = 5/3"]] },
      { eq: "(5 − y)/2 = 3/4", steps: [["mul", "4", "2(5 − y) = 3"], ["expand", "Expand the bracket on the left side", "10 − 2y = 3"], ["sub", "10", "−2y = −7"], ["div", "−2", "y = 7/2"]] },
      { eq: "(1 − 2k)/5 = 1/2", steps: [["mul", "10", "2(1 − 2k) = 5"], ["expand", "Expand the bracket on the left side", "2 − 4k = 5"], ["sub", "2", "−4k = 3"], ["div", "−4", "k = −3/4"]] }
    ] },
  { id: "4.3Eb", example: "4.3 (Extra)", part: "b", type: "Fractions · negative denominator", eq: "3(y + 4)/(−4) = 2",
    steps: [["mul", "−4", "3(y + 4) = −8"], ["expand", "Expand the bracket on the left side", "3y + 12 = −8"],
            ["sub", "12", "3y = −20"], ["div", "3", "y = −20/3"]],
    sims: [
      { eq: "2(x + 3)/(−5) = 4", steps: [["mul", "−5", "2(x + 3) = −20"], ["expand", "Expand the bracket on the left side", "2x + 6 = −20"], ["sub", "6", "2x = −26"], ["div", "2", "x = −13"]] },
      { eq: "5(y − 2)/(−3) = 4", steps: [["mul", "−3", "5(y − 2) = −12"], ["expand", "Expand the bracket on the left side", "5y − 10 = −12"], ["add", "10", "5y = −2"], ["div", "5", "y = −2/5"]] },
      { eq: "4(a + 1)/(−3) = 2", steps: [["mul", "−3", "4(a + 1) = −6"], ["expand", "Expand the bracket on the left side", "4a + 4 = −6"], ["sub", "4", "4a = −10"], ["div", "4", "a = −5/2"]] }
    ] },
  { id: "4.3Ec", example: "4.3 (Extra)", part: "c", type: "Fractions on both sides", eq: "(13 − 3z)/21 = 1/3",
    steps: [["mul", "21", "13 − 3z = 7"], ["sub", "13", "−3z = −6"], ["div", "−3", "z = 2"]],
    sims: [
      { eq: "(11 − 2x)/15 = 1/5", steps: [["mul", "15", "11 − 2x = 3"], ["sub", "11", "−2x = −8"], ["div", "−2", "x = 4"]] },
      { eq: "(9 − 4y)/14 = 1/2", steps: [["mul", "14", "9 − 4y = 7"], ["sub", "9", "−4y = −2"], ["div", "−4", "y = 1/2"]] },
      { eq: "(20 − 3m)/12 = 2/3", steps: [["mul", "12", "20 − 3m = 8"], ["sub", "20", "−3m = −12"], ["div", "−3", "m = 4"]] }
    ] },

  // ───────────── Teaching Example 4.4 ─────────────
  { id: "4.4a", example: "4.4", part: "a", type: "Like terms", eq: "7x − 3x = 20",
    steps: [["combine", "Combine the like terms on the left side", "4x = 20"], ["div", "4", "x = 5"]],
    sims: [
      { eq: "9x − 4x = 35", steps: [["combine", "Combine the like terms on the left side", "5x = 35"], ["div", "5", "x = 7"]] },
      { eq: "6y − 8y = 14", steps: [["combine", "Combine the like terms on the left side", "−2y = 14"], ["div", "−2", "y = −7"]] },
      { eq: "5a + 3a = −24", steps: [["combine", "Combine the like terms on the left side", "8a = −24"], ["div", "8", "a = −3"]] }
    ] },
  { id: "4.4b", example: "4.4", part: "b", type: "Like terms · with a constant", eq: "3y + 12 − 8y = 27",
    steps: [["combine", "Combine the like terms on the left side", "−5y + 12 = 27"], ["sub", "12", "−5y = 15"], ["div", "−5", "y = −3"]],
    sims: [
      { eq: "4x + 9 − 7x = 21", steps: [["combine", "Combine the like terms on the left side", "−3x + 9 = 21"], ["sub", "9", "−3x = 12"], ["div", "−3", "x = −4"]] },
      { eq: "2y − 5 + 6y = 19", steps: [["combine", "Combine the like terms on the left side", "8y − 5 = 19"], ["add", "5", "8y = 24"], ["div", "8", "y = 3"]] },
      { eq: "5m + 14 − 9m = −6", steps: [["combine", "Combine the like terms on the left side", "−4m + 14 = −6"], ["sub", "14", "−4m = −20"], ["div", "−4", "m = 5"]] }
    ] },

  // ───────────── Teaching Example 4.5 ─────────────
  { id: "4.5a", example: "4.5", part: "a", type: "Unknowns on both sides", eq: "7a = 4a + 24",
    steps: [["sub", "4a", "3a = 24"], ["div", "3", "a = 8"]],
    sims: [
      { eq: "9b = 5b + 28", steps: [["sub", "5b", "4b = 28"], ["div", "4", "b = 7"]] },
      { eq: "6x = 2x − 20", steps: [["sub", "2x", "4x = −20"], ["div", "4", "x = −5"]] },
      { eq: "5k = 8k + 18", steps: [["sub", "8k", "−3k = 18"], ["div", "−3", "k = −6"]] }
    ] },
  { id: "4.5b", example: "4.5", part: "b", type: "Unknowns on both sides · with constants", eq: "2b − 3 = 6b + 17",
    steps: [["sub", "2b", "−3 = 4b + 17"], ["sub", "17", "−20 = 4b"], ["div", "4", "b = −5"]],
    sims: [
      { eq: "3x − 5 = 7x + 11", steps: [["sub", "3x", "−5 = 4x + 11"], ["sub", "11", "−16 = 4x"], ["div", "4", "x = −4"]] },
      { eq: "4y + 9 = 9y − 6", steps: [["sub", "4y", "9 = 5y − 6"], ["add", "6", "15 = 5y"], ["div", "5", "y = 3"]] },
      { eq: "5c − 2 = 8c + 10", steps: [["sub", "5c", "−2 = 3c + 10"], ["sub", "10", "−12 = 3c"], ["div", "3", "c = −4"]] }
    ] },

  // ───────────── Teaching Example 4.6 ─────────────
  { id: "4.6a", example: "4.6", part: "a", type: "Brackets · unknowns on both sides", eq: "3(x − 2) = x + 8",
    steps: [["expand", "Expand the bracket on the left side", "3x − 6 = x + 8"], ["sub", "x", "2x − 6 = 8"], ["add", "6", "2x = 14"], ["div", "2", "x = 7"]],
    sims: [
      { eq: "4(x − 3) = x + 6", steps: [["expand", "Expand the bracket on the left side", "4x − 12 = x + 6"], ["sub", "x", "3x − 12 = 6"], ["add", "12", "3x = 18"], ["div", "3", "x = 6"]] },
      { eq: "5(y + 2) = 2y − 8", steps: [["expand", "Expand the bracket on the left side", "5y + 10 = 2y − 8"], ["sub", "2y", "3y + 10 = −8"], ["sub", "10", "3y = −18"], ["div", "3", "y = −6"]] },
      { eq: "2(a − 5) = a + 3", steps: [["expand", "Expand the bracket on the left side", "2a − 10 = a + 3"], ["sub", "a", "a − 10 = 3"], ["add", "10", "a = 13"]] }
    ] },
  { id: "4.6b", example: "4.6", part: "b", type: "Brackets · two brackets", eq: "2(y − 3) − 3(y − 4) = 8",
    steps: [["expand", "Expand both brackets", "2y − 6 − 3y + 12 = 8", { hint: "Multiply each term in the first bracket by 2 and each term in the second bracket by −3. Watch the sign: (−3) × (−4) = +12.", wrong: ["Expand the second bracket as −3y − 12", "Multiply only the first term in each bracket"] }],
            ["combine", "Combine the like terms on the left side", "−y + 6 = 8"], ["sub", "6", "−y = 2"], ["div", "−1", "y = −2"]],
    sims: [
      { eq: "3(x − 2) − 2(x − 5) = 9",
        steps: [["expand", "Expand both brackets", "3x − 6 − 2x + 10 = 9", { hint: "Multiply each term in the first bracket by 3 and each term in the second bracket by −2. Watch the sign: (−2) × (−5) = +10.", wrong: ["Expand the second bracket as −2x − 10", "Multiply only the first term in each bracket"] }],
                ["combine", "Combine the like terms on the left side", "x + 4 = 9"], ["sub", "4", "x = 5"]] },
      { eq: "4(y + 1) − 5(y − 2) = 11",
        steps: [["expand", "Expand both brackets", "4y + 4 − 5y + 10 = 11", { hint: "Multiply each term in the first bracket by 4 and each term in the second bracket by −5. Watch the sign: (−5) × (−2) = +10.", wrong: ["Expand the second bracket as −5y − 10", "Multiply only the first term in each bracket"] }],
                ["combine", "Combine the like terms on the left side", "−y + 14 = 11"], ["sub", "14", "−y = −3"], ["div", "−1", "y = 3"]] },
      { eq: "5(m − 1) − 2(m + 4) = 2",
        steps: [["expand", "Expand both brackets", "5m − 5 − 2m − 8 = 2", { hint: "Multiply each term in the first bracket by 5 and each term in the second bracket by −2. Watch the sign: (−2) × 4 = −8.", wrong: ["Expand the second bracket as −2m + 8", "Multiply only the first term in each bracket"] }],
                ["combine", "Combine the like terms on the left side", "3m − 13 = 2"], ["add", "13", "3m = 15"], ["div", "3", "m = 5"]] }
    ] },

  // ───────────── Teaching Example 4.7 ─────────────
  { id: "4.7", example: "4.7", part: "", type: "Brackets · nested brackets", eq: "3[3m − (m − 2)] = 2m − 6",
    steps: [["expand", "Remove the inner brackets", "3[3m − m + 2] = 2m − 6", { hint: "Start with the innermost brackets. The minus sign in front changes the sign of every term inside: −(m − 2) = −m + 2.", wrong: ["Remove the inner brackets as 3m − m − 2", "Remove the square brackets first by multiplying only 3m by 3"] }],
            ["combine", "Combine the like terms inside the brackets", "3(2m + 2) = 2m − 6"],
            ["expand", "Expand the bracket on the left side", "6m + 6 = 2m − 6"],
            ["sub", "2m", "4m + 6 = −6"], ["sub", "6", "4m = −12"], ["div", "4", "m = −3"]],
    sims: [
      { eq: "2[4m − (m − 3)] = 3m + 12",
        steps: [["expand", "Remove the inner brackets", "2[4m − m + 3] = 3m + 12", { hint: "Start with the innermost brackets: −(m − 3) = −m + 3.", wrong: ["Remove the inner brackets as 4m − m − 3", "Remove the square brackets first by multiplying only 4m by 2"] }],
                ["combine", "Combine the like terms inside the brackets", "2(3m + 3) = 3m + 12"],
                ["expand", "Expand the bracket on the left side", "6m + 6 = 3m + 12"],
                ["sub", "3m", "3m + 6 = 12"], ["sub", "6", "3m = 6"], ["div", "3", "m = 2"]] },
      { eq: "4[2x − (x + 1)] = x + 5",
        steps: [["expand", "Remove the inner brackets", "4[2x − x − 1] = x + 5", { hint: "Start with the innermost brackets: −(x + 1) = −x − 1.", wrong: ["Remove the inner brackets as 2x − x + 1", "Remove the square brackets first by multiplying only 2x by 4"] }],
                ["combine", "Combine the like terms inside the brackets", "4(x − 1) = x + 5"],
                ["expand", "Expand the bracket on the left side", "4x − 4 = x + 5"],
                ["sub", "x", "3x − 4 = 5"], ["add", "4", "3x = 9"], ["div", "3", "x = 3"]] },
      { eq: "3[5k − (2k − 1)] = 4k − 7",
        steps: [["expand", "Remove the inner brackets", "3[5k − 2k + 1] = 4k − 7", { hint: "Start with the innermost brackets: −(2k − 1) = −2k + 1.", wrong: ["Remove the inner brackets as 5k − 2k − 1", "Remove the square brackets first by multiplying only 5k by 3"] }],
                ["combine", "Combine the like terms inside the brackets", "3(3k + 1) = 4k − 7"],
                ["expand", "Expand the bracket on the left side", "9k + 3 = 4k − 7"],
                ["sub", "4k", "5k + 3 = −7"], ["sub", "3", "5k = −10"], ["div", "5", "k = −2"]] }
    ] },

  // ───────────── Teaching Example 4.7 (Extra) ─────────────
  { id: "4.7E", example: "4.7 (Extra)", part: "", type: "Brackets · nested brackets on both sides", eq: "2[3m − (m + 4)] = 4(1 − m) + 3",
    steps: [["expand", "Remove the inner brackets on the left side", "2[3m − m − 4] = 4(1 − m) + 3", { hint: "Start with the innermost brackets: −(m + 4) = −m − 4.", wrong: ["Remove the inner brackets as 3m − m + 4", "Remove the square brackets first by multiplying only 3m by 2"] }],
            ["combine", "Combine the like terms inside the brackets", "2(2m − 4) = 4(1 − m) + 3"],
            ["expand", "Expand the brackets on both sides", "4m − 8 = 4 − 4m + 3", { hint: "Expand 2(2m − 4) on the left and 4(1 − m) on the right. Multiply every term inside each bracket." }],
            ["combine", "Combine the constants on the right side", "4m − 8 = 7 − 4m"],
            ["add", "4m", "8m − 8 = 7"], ["add", "8", "8m = 15"], ["div", "8", "m = 15/8"]],
    sims: [
      { eq: "3[2x − (x + 1)] = 2(4 − x) + 1",
        steps: [["expand", "Remove the inner brackets on the left side", "3[2x − x − 1] = 2(4 − x) + 1", { hint: "Start with the innermost brackets: −(x + 1) = −x − 1.", wrong: ["Remove the inner brackets as 2x − x + 1", "Remove the square brackets first by multiplying only 2x by 3"] }],
                ["combine", "Combine the like terms inside the brackets", "3(x − 1) = 2(4 − x) + 1"],
                ["expand", "Expand the brackets on both sides", "3x − 3 = 8 − 2x + 1"],
                ["combine", "Combine the constants on the right side", "3x − 3 = 9 − 2x"],
                ["add", "2x", "5x − 3 = 9"], ["add", "3", "5x = 12"], ["div", "5", "x = 12/5"]] },
      { eq: "2[4y − (y − 3)] = 3(2 − y) + 5",
        steps: [["expand", "Remove the inner brackets on the left side", "2[4y − y + 3] = 3(2 − y) + 5", { hint: "Start with the innermost brackets: −(y − 3) = −y + 3.", wrong: ["Remove the inner brackets as 4y − y − 3", "Remove the square brackets first by multiplying only 4y by 2"] }],
                ["combine", "Combine the like terms inside the brackets", "2(3y + 3) = 3(2 − y) + 5"],
                ["expand", "Expand the brackets on both sides", "6y + 6 = 6 − 3y + 5"],
                ["combine", "Combine the constants on the right side", "6y + 6 = 11 − 3y"],
                ["add", "3y", "9y + 6 = 11"], ["sub", "6", "9y = 5"], ["div", "9", "y = 5/9"]] },
      { eq: "4[2k − (k + 2)] = 2(3 − k) + 4",
        steps: [["expand", "Remove the inner brackets on the left side", "4[2k − k − 2] = 2(3 − k) + 4", { hint: "Start with the innermost brackets: −(k + 2) = −k − 2.", wrong: ["Remove the inner brackets as 2k − k + 2", "Remove the square brackets first by multiplying only 2k by 4"] }],
                ["combine", "Combine the like terms inside the brackets", "4(k − 2) = 2(3 − k) + 4"],
                ["expand", "Expand the brackets on both sides", "4k − 8 = 6 − 2k + 4"],
                ["combine", "Combine the constants on the right side", "4k − 8 = 10 − 2k"],
                ["add", "2k", "6k − 8 = 10"], ["add", "8", "6k = 18"], ["div", "6", "k = 3"]] }
    ] },

  // ───────────── Teaching Example 4.8 ─────────────
  { id: "4.8a", example: "4.8", part: "a", type: "Fractions · L.C.M. of denominators", eq: "x/2 + x/3 = −15",
    steps: [["mul", "6", "3x + 2x = −90"], ["combine", "Combine the like terms on the left side", "5x = −90"], ["div", "5", "x = −18"]],
    sims: [
      { eq: "x/3 + x/4 = 14", steps: [["mul", "12", "4x + 3x = 168"], ["combine", "Combine the like terms on the left side", "7x = 168"], ["div", "7", "x = 24"]] },
      { eq: "y/2 − y/5 = 6", steps: [["mul", "10", "5y − 2y = 60"], ["combine", "Combine the like terms on the left side", "3y = 60"], ["div", "3", "y = 20"]] },
      { eq: "a/4 + a/6 = −10", steps: [["mul", "12", "3a + 2a = −120"], ["combine", "Combine the like terms on the left side", "5a = −120"], ["div", "5", "a = −24"]] }
    ] },
  { id: "4.8b", example: "4.8", part: "b", type: "Fractions · subtracting a fraction", eq: "y/8 − (y + 3)/6 = −1",
    steps: [["mul", "24", "3y − 4(y + 3) = −24", { hint: "24 is the L.C.M. of 8 and 6. Multiply every term by 24 and keep (y + 3) in a bracket — the minus sign belongs to the whole numerator." }],
            ["expand", "Expand the bracket", "3y − 4y − 12 = −24", { hint: "Multiply both terms in the bracket by −4: (−4) × y and (−4) × 3.", wrong: ["Expand the bracket as −4y + 12", "Multiply only y by −4"] }],
            ["combine", "Combine the like terms on the left side", "−y − 12 = −24"], ["add", "12", "−y = −12"], ["div", "−1", "y = 12"]],
    sims: [
      { eq: "x/6 − (x + 2)/4 = −2",
        steps: [["mul", "12", "2x − 3(x + 2) = −24", { hint: "12 is the L.C.M. of 6 and 4. Multiply every term by 12 and keep (x + 2) in a bracket." }],
                ["expand", "Expand the bracket", "2x − 3x − 6 = −24", { hint: "Multiply both terms in the bracket by −3.", wrong: ["Expand the bracket as −3x + 6", "Multiply only x by −3"] }],
                ["combine", "Combine the like terms on the left side", "−x − 6 = −24"], ["add", "6", "−x = −18"], ["div", "−1", "x = 18"]] },
      { eq: "y/3 − (y − 1)/4 = 1",
        steps: [["mul", "12", "4y − 3(y − 1) = 12", { hint: "12 is the L.C.M. of 3 and 4. Multiply every term by 12 and keep (y − 1) in a bracket." }],
                ["expand", "Expand the bracket", "4y − 3y + 3 = 12", { hint: "Multiply both terms in the bracket by −3: (−3) × (−1) = +3.", wrong: ["Expand the bracket as −3y − 3", "Multiply only y by −3"] }],
                ["combine", "Combine the like terms on the left side", "y + 3 = 12"], ["sub", "3", "y = 9"]] },
      { eq: "a/5 − (a + 4)/10 = −2",
        steps: [["mul", "10", "2a − (a + 4) = −20", { hint: "10 is the L.C.M. of 5 and 10. Multiply every term by 10 and keep (a + 4) in a bracket." }],
                ["expand", "Remove the bracket", "2a − a − 4 = −20", { hint: "The minus sign in front of the bracket changes the sign of each term inside: −(a + 4) = −a − 4.", wrong: ["Remove the bracket as 2a − a + 4", "Multiply only a by −1"] }],
                ["combine", "Combine the like terms on the left side", "a − 4 = −20"], ["add", "4", "a = −16"]] }
    ] },

  // ───────────── Teaching Example 4.9 ─────────────
  { id: "4.9", example: "4.9", part: "", type: "Fractions on both sides", eq: "(x + 5)/6 = 3x/8",
    steps: [["mul", "24", "4(x + 5) = 9x"], ["expand", "Expand the bracket on the left side", "4x + 20 = 9x"], ["sub", "4x", "20 = 5x"], ["div", "5", "x = 4"]],
    sims: [
      { eq: "(x + 3)/4 = 2x/5", steps: [["mul", "20", "5(x + 3) = 8x"], ["expand", "Expand the bracket on the left side", "5x + 15 = 8x"], ["sub", "5x", "15 = 3x"], ["div", "3", "x = 5"]] },
      { eq: "(y − 2)/3 = 3y/4", steps: [["mul", "12", "4(y − 2) = 9y"], ["expand", "Expand the bracket on the left side", "4y − 8 = 9y"], ["sub", "4y", "−8 = 5y"], ["div", "5", "y = −8/5"]] },
      { eq: "(m + 7)/4 = 3m/8", steps: [["mul", "8", "2(m + 7) = 3m"], ["expand", "Expand the bracket on the left side", "2m + 14 = 3m"], ["sub", "2m", "m = 14"]] }
    ] },

  // ───────────── Teaching Example 4.9 (Extra) ─────────────
  { id: "4.9E", example: "4.9 (Extra)", part: "", type: "Fractions · three fractions", eq: "(2x − 1)/6 = (3x + 1)/4 + 1/3",
    steps: [["mul", "12", "2(2x − 1) = 3(3x + 1) + 4"], ["expand", "Expand the brackets on both sides", "4x − 2 = 9x + 3 + 4"],
            ["combine", "Combine the constants on the right side", "4x − 2 = 9x + 7"], ["sub", "4x", "−2 = 5x + 7"], ["sub", "7", "−9 = 5x"], ["div", "5", "x = −9/5"]],
    sims: [
      { eq: "(3x − 1)/4 = (x + 2)/6 + 1/2",
        steps: [["mul", "12", "3(3x − 1) = 2(x + 2) + 6"], ["expand", "Expand the brackets on both sides", "9x − 3 = 2x + 4 + 6"],
                ["combine", "Combine the constants on the right side", "9x − 3 = 2x + 10"], ["sub", "2x", "7x − 3 = 10"], ["add", "3", "7x = 13"], ["div", "7", "x = 13/7"]] },
      { eq: "(y + 3)/4 = (2y − 1)/3 + 1/6",
        steps: [["mul", "12", "3(y + 3) = 4(2y − 1) + 2"], ["expand", "Expand the brackets on both sides", "3y + 9 = 8y − 4 + 2"],
                ["combine", "Combine the constants on the right side", "3y + 9 = 8y − 2"], ["sub", "3y", "9 = 5y − 2"], ["add", "2", "11 = 5y"], ["div", "5", "y = 11/5"]] },
      { eq: "(4k + 1)/6 = (k − 2)/4 + 5/3",
        steps: [["mul", "12", "2(4k + 1) = 3(k − 2) + 20"], ["expand", "Expand the brackets on both sides", "8k + 2 = 3k − 6 + 20"],
                ["combine", "Combine the constants on the right side", "8k + 2 = 3k + 14"], ["sub", "3k", "5k + 2 = 14"], ["sub", "2", "5k = 12"], ["div", "5", "k = 12/5"]] }
    ] },

  // ───────────── Teaching Example 4.10 ─────────────
  { id: "4.10", example: "4.10", part: "", type: "Brackets with fractions", eq: "2(s/3 − 1) = s/2 − 4",
    steps: [["expand", "Expand the bracket on the left side", "2s/3 − 2 = s/2 − 4", { hint: "Multiply both terms inside the bracket by 2: 2 × s/3 = 2s/3 and 2 × (−1) = −2." }],
            ["mul", "6", "4s − 12 = 3s − 24"], ["sub", "3s", "s − 12 = −24"], ["add", "12", "s = −12"]],
    sims: [
      { eq: "3(x/4 − 1) = x/2 − 5",
        steps: [["expand", "Expand the bracket on the left side", "3x/4 − 3 = x/2 − 5"], ["mul", "4", "3x − 12 = 2x − 20"], ["sub", "2x", "x − 12 = −20"], ["add", "12", "x = −8"]] },
      { eq: "2(y/5 + 1) = y/2 − 1",
        steps: [["expand", "Expand the bracket on the left side", "2y/5 + 2 = y/2 − 1"], ["mul", "10", "4y + 20 = 5y − 10"], ["sub", "4y", "20 = y − 10"], ["add", "10", "y = 30"]] },
      { eq: "4(m/3 − 2) = m/2 + 2",
        steps: [["expand", "Expand the bracket on the left side", "4m/3 − 8 = m/2 + 2"], ["mul", "6", "8m − 48 = 3m + 12"], ["sub", "3m", "5m − 48 = 12"], ["add", "48", "5m = 60"], ["div", "5", "m = 12"]] }
    ] },

  // ───────────── Teaching Example 4.10 (Extra) ─────────────
  { id: "4.10E", example: "4.10 (Extra)", part: "", type: "Brackets with fractions on both sides", eq: "−3(t/5 + 1) = 3(t/2 − 1) + 7",
    steps: [["expand", "Expand the brackets on both sides", "−3t/5 − 3 = 3t/2 − 3 + 7", { hint: "Multiply each term in the left bracket by −3 and each term in the right bracket by 3." }],
            ["combine", "Combine the constants on the right side", "−3t/5 − 3 = 3t/2 + 4"],
            ["mul", "10", "−6t − 30 = 15t + 40"], ["add", "6t", "−30 = 21t + 40"], ["sub", "40", "−70 = 21t"], ["div", "21", "t = −10/3"]],
    sims: [
      { eq: "−3(x/4 + 2) = 3(x/2 − 2) + 6",
        steps: [["expand", "Expand the brackets on both sides", "−3x/4 − 6 = 3x/2 − 6 + 6"],
                ["combine", "Combine the constants on the right side", "−3x/4 − 6 = 3x/2"],
                ["mul", "4", "−3x − 24 = 6x"], ["add", "3x", "−24 = 9x"], ["div", "9", "x = −8/3"]] },
      { eq: "−5(y/6 + 1) = 5(y/3 − 1) + 5",
        steps: [["expand", "Expand the brackets on both sides", "−5y/6 − 5 = 5y/3 − 5 + 5"],
                ["combine", "Combine the constants on the right side", "−5y/6 − 5 = 5y/3"],
                ["mul", "6", "−5y − 30 = 10y"], ["add", "5y", "−30 = 15y"], ["div", "15", "y = −2"]] },
      { eq: "−4(k/3 + 2) = 5(k/6 − 1) + 10",
        steps: [["expand", "Expand the brackets on both sides", "−4k/3 − 8 = 5k/6 − 5 + 10"],
                ["combine", "Combine the constants on the right side", "−4k/3 − 8 = 5k/6 + 5"],
                ["mul", "6", "−8k − 48 = 5k + 30"], ["add", "8k", "−48 = 13k + 30"], ["sub", "30", "−78 = 13k"], ["div", "13", "k = −6"]] }
    ] }
];
