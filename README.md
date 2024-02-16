# Homework task

This is a small node application that generates a PDF file using puppeteer. You can check src/pdf/pdf.controller.ts to see how it generates a very dummy PDF file.

Step 1: install dependencies and make sure you can run the application: `npm run dev`

Step 2: run a performance check: `npm run test:perf`. This will trigger 25 parallel request for PDF generation

# Goal

If you would monitor processes in your computer you would notice that PDF generation (puppeteer) launches headless chromium instance, renders a page and exports it as PDF. When server receives 25 requests at once, it will spin 25 instances of headless chromium.

The goal of the task is to optimize pdf.service.ts so that it does not launch a new instance of puppeteer every time a request is received but rather reuses one or couple of instances. Do not install any new npm packages. It would be great to see native code implementing instance reusability.

It would great to see what is the number of instances in the logs.

Extra points for a test checking if the implementation works well.

For the followup call some topics to discuss:
- is there a positive performance impact?
- what are other possibilities to improve performance?
- what is the best time to launch the instance?
- what's the benefit of having one instance or two instances?
