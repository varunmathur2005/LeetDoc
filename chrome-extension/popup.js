document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("metadataForm");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const metadata = {
            difficulty: document.getElementById("difficulty").value,
            trick: document.getElementById("trick").value.trim(),
            timeComplexity: document.getElementById("timeComplexity").value.trim(),
            spaceComplexity: document.getElementById("spaceComplexity").value.trim(),
            dataStructures: document.getElementById("dataStructures").value.trim(),
            timeTaken: document.getElementById("timeTaken").value.trim(),
            notes: document.getElementById("notes").value.trim(),
            pattern: document.getElementById("pattern").value.trim()
        };

        console.log("📦 Metadata submitted:", metadata);

        // You can show a toast / success message here if you like
        alert("✅ Metadata saved (not yet uploaded to DB). Check console.");
    });
});
