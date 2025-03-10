/*******************************************************
 * leetcode.js
 *
 * Content script for LeetDoc Chrome Extension.
 * Captures problem data on valid LeetCode problem URLs,
 * then attaches the user’s solution after acceptance.
 *******************************************************/
console.log("🚀 LeetDoc Scraper Loaded!");

// Only match: https://leetcode.com/problems/<slug>[/description/]
const PROBLEM_URL_REGEX = /^https:\/\/leetcode\.com\/problems\/[^/]+\/?(description)?\/?$/;

(function main() {
    // 1) If not on a valid problem page, do nothing
    if (!PROBLEM_URL_REGEX.test(window.location.href)) {
        console.log("🔸 Not a recognized LeetCode problem URL. Scraper not activated.");
        return;
    }

    console.log("🔹 Valid LeetCode problem URL—activating scraper.");

    /**
     * Captures the problem details (title, statement, difficulty, topics)
     * and stores them in localStorage (leetdoc_tempProblem).
     */
    function captureProblem() {
        // Title is in an anchor like: <a href="/problems/two-sum/">1. Two Sum</a>
        const titleSel = document.querySelector('a[href^="/problems/"][class*="no-underline"]')?.innerText || "Unknown";

        // Difficulty is in a div whose class includes "text-difficulty-"
        const difficultyEl = document.querySelector('.flex.gap-1 div[class*="text-difficulty-"]');
        const difficultySel = difficultyEl?.innerText || "Unknown";

        // Problem statement container
        const statementSel = document.querySelector('.elfjS[data-track-load="description_content"]')?.innerText || "No statement found";

        // Topics (optional)
        const topicsSel = Array.from(document.querySelectorAll(".topic-tag")).map(el => el.innerText) || ["Uncategorized"];

        // Problem URL – full URL or just the path (your choice)
        // For the full URL:
        const problemUrl = window.location.href;

        // Alternatively, if you only want the path (e.g. "/problems/two-sum"):
        // const problemUrl = new URL(window.location.href).pathname;

        const tempProblem = {
            title: titleSel,
            statement: statementSel,
            difficulty: difficultySel,
            topics: topicsSel,
            url: problemUrl
            // solution + timestamp will be added upon "Accepted"
        };

        localStorage.setItem("leetdoc_tempProblem", JSON.stringify(tempProblem));
        console.log("📥 Problem captured (temp):", tempProblem);
    }



    /**
     * Checks if we see an "Accepted" label (.text-green-s).
     * If so, attaches the user's solution to the temp problem
     * and appends it to 'leetdoc_problems' in localStorage.
     * Returns true if a solution was successfully attached, false otherwise.
     */
    function attachSolutionIfAccepted() {
        // Is "Accepted" label present?
        const acceptedTag = document.querySelector(".text-green-s");
        if (!acceptedTag) return false;

        // Retrieve temp problem
        const tempProblemRaw = localStorage.getItem("leetdoc_tempProblem");
        if (!tempProblemRaw) {
            console.log("✅ 'Accepted' found, but no temp problem stored—nothing to attach.");
            return false;
        }

        console.log("✅ Solution Accepted! Attaching solution to temp problem...");

        const tempProblem = JSON.parse(tempProblemRaw);
        const userSolution = document.querySelector(".view-lines")?.innerText || "No solution found";

        // Final problem object
        const finalProblemData = {
            ...tempProblem,
            solution: userSolution,
            timestamp: new Date().toISOString()
        };

        // Save permanently to 'leetdoc_problems'
        const storedProblems = JSON.parse(localStorage.getItem("leetdoc_problems") || "[]");
        storedProblems.push(finalProblemData);
        localStorage.setItem("leetdoc_problems", JSON.stringify(storedProblems));

        console.log("📋 Final Problem Data:", finalProblemData);
        console.log("💾 Appended to 'leetdoc_problems' array in localStorage!");

        // Remove the temp problem so it won't be re-used
        localStorage.removeItem("leetdoc_tempProblem");
        return true;
    }

    /**
     * Observes the DOM for new nodes.
     * If we detect an "Accepted" label, attach the solution and stop observing.
     */
    function startAcceptanceObserver() {
        const observer = new MutationObserver(() => {
            if (attachSolutionIfAccepted()) {
                // Stop observing once we attach a solution
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- Main routine ---
    captureProblem();
    startAcceptanceObserver();
})();
