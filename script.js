var form = document.getElementById("resume-form");
var resumeOutput = document.getElementById("resume-output");
var usernameInput = document.getElementById("username-input");
var shareLink = document.getElementById("share-link");
var copyLinkButton = document.getElementById("copy-link");
form === null || form === void 0 ? void 0 : form.addEventListener("submit", function (event) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    event.preventDefault();
    var formData = new FormData(form);
    var name = ((_a = formData.get("name")) === null || _a === void 0 ? void 0 : _a.toString()) || "";
    var email = ((_b = formData.get("email")) === null || _b === void 0 ? void 0 : _b.toString()) || "";
    var phone = ((_c = formData.get("phone")) === null || _c === void 0 ? void 0 : _c.toString()) || "";
    var address = ((_d = formData.get("address")) === null || _d === void 0 ? void 0 : _d.toString()) || "";
    var degree = ((_e = formData.get("degree")) === null || _e === void 0 ? void 0 : _e.toString()) || "";
    var university = ((_f = formData.get("university")) === null || _f === void 0 ? void 0 : _f.toString()) || "";
    var year = parseInt(((_g = formData.get("year")) === null || _g === void 0 ? void 0 : _g.toString()) || "NaN", 10);
    var company = ((_h = formData.get("company")) === null || _h === void 0 ? void 0 : _h.toString()) || "";
    var role = ((_j = formData.get("role")) === null || _j === void 0 ? void 0 : _j.toString()) || "";
    var duration = parseInt(((_k = formData.get("duration")) === null || _k === void 0 ? void 0 : _k.toString()) || "NaN", 10);
    var skillsInput = ((_l = formData.get("skills")) === null || _l === void 0 ? void 0 : _l.toString()) || "";
    if (!name || !email || !degree || !university || isNaN(year) || !company || !role || isNaN(duration)) {
        alert("Please fill out all required fields.");
        return;
    }
    var resume = {
        name: name,
        email: email,
        phone: phone,
        address: address,
        education: { degree: degree, university: university, year: year },
        workExperience: { company: company, role: role, duration: duration },
        skills: skillsInput.split(",").map(function (skill) { return skill.trim(); }).filter(function (skill) { return skill.length > 0; })
    };
    generateResume(resume);
});
function generateResume(resume) {
    var _a;
    var resumeHtml = "\n    <h2 contenteditable=\"true\">".concat(resume.name, "</h2>\n    <p><strong>Email:</strong> <span contenteditable=\"true\">").concat(resume.email, "</span></p>\n    <p><strong>Phone:</strong> <span contenteditable=\"true\">").concat(resume.phone, "</span></p>\n    <p><strong>Address:</strong> <span contenteditable=\"true\">").concat(resume.address, "</span></p>\n    <h3>Education</h3>\n    <p><strong>").concat(resume.education.degree, "</strong> at <span contenteditable=\"true\">").concat(resume.education.university, "</span>, \n    <span contenteditable=\"true\">").concat(resume.education.year, "</span></p>\n    <h3>Work Experience</h3>\n    <p><strong>").concat(resume.workExperience.role, "</strong> at <span contenteditable=\"true\">").concat(resume.workExperience.company, "</span> \n    for <span contenteditable=\"true\">").concat(resume.workExperience.duration, "</span> years</p>\n    <h3>Skills</h3>\n    <ul>\n      ").concat(resume.skills.map(function (skill) { return "<li contenteditable=\"true\">".concat(skill, "</li>"); }).join(''), "\n    </ul>\n  ");
    resumeOutput.innerHTML = resumeHtml;
    // Hide the form after resume is generated
    (_a = document.querySelector(".form")) === null || _a === void 0 ? void 0 : _a.setAttribute("style", "display: none;");
    resumeOutput.style.display = "block";
    // Generate unique URL with resume data
    var username = (usernameInput === null || usernameInput === void 0 ? void 0 : usernameInput.value.trim()) || "user";
    var resumeData = encodeURIComponent(JSON.stringify(resume)); // Encode resume data to avoid URL issues
    var resumeUrl = "".concat(window.location.href.split('?')[0], "?username=").concat(username, "&data=").concat(resumeData);
    // Update the share link with the generated URL
    if (shareLink) {
        shareLink.href = resumeUrl;
        shareLink.textContent = "Click to View Your Resume";
    }
    // Enable copy link button
    if (copyLinkButton) {
        copyLinkButton.style.display = "inline-block";
        copyLinkButton.onclick = function () {
            navigator.clipboard.writeText(resumeUrl).then(function () {
                alert("URL copied to clipboard!");
            });
        };
    }
}
// Handle URL parameters to display only the resume
window.onload = function () {
    var params = new URLSearchParams(window.location.search);
    if (params.has('data')) {
        var resumeData = JSON.parse(decodeURIComponent(params.get('data')));
        generateResume(resumeData);
    }
};
function downloadResumeAsPDF() {
    var resumeElement = document.getElementById("resume-output");
    if (resumeElement) {
        html2pdf()
            .from(resumeElement)
            .save("resume.pdf");
    }
}
