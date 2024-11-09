declare function html2pdf(): any;
interface Resume {
  name: string;
  email: string;
  phone: string;
  address: string;
  education: {
    degree: string;
    university: string;
    year: number;
  };
  workExperience: {
    company: string;
    role: string;
    duration: number;
  };
  skills: string[];
}

const form = document.getElementById("resume-form") as HTMLFormElement;
const resumeOutput = document.getElementById("resume-output") as HTMLElement;
const usernameInput = document.getElementById("username-input") as HTMLInputElement;
const shareLink = document.getElementById("share-link") as HTMLAnchorElement;
const copyLinkButton = document.getElementById("copy-link") as HTMLButtonElement;

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const phone = formData.get("phone")?.toString() || "";
  const address = formData.get("address")?.toString() || "";
  const degree = formData.get("degree")?.toString() || "";
  const university = formData.get("university")?.toString() || "";
  const year = parseInt(formData.get("year")?.toString() || "NaN", 10);
  const company = formData.get("company")?.toString() || "";
  const role = formData.get("role")?.toString() || "";
  const duration = parseInt(formData.get("duration")?.toString() || "NaN", 10);
  const skillsInput = formData.get("skills")?.toString() || "";

  if (!name || !email || !degree || !university || isNaN(year) || !company || !role || isNaN(duration)) {
    alert("Please fill out all required fields.");
    return;
  }

  const resume: Resume = {
    name,
    email,
    phone,
    address,
    education: { degree, university, year },
    workExperience: { company, role, duration },
    skills: skillsInput.split(",").map(skill => skill.trim()).filter(skill => skill.length > 0)
  };

  generateResume(resume);
});

function generateResume(resume: Resume) {
  const resumeHtml = `
    <h2 contenteditable="true">${resume.name}</h2>
    <p><strong>Email:</strong> <span contenteditable="true">${resume.email}</span></p>
    <p><strong>Phone:</strong> <span contenteditable="true">${resume.phone}</span></p>
    <p><strong>Address:</strong> <span contenteditable="true">${resume.address}</span></p>
    <h3>Education</h3>
    <p><strong>${resume.education.degree}</strong> at <span contenteditable="true">${resume.education.university}</span>, 
    <span contenteditable="true">${resume.education.year}</span></p>
    <h3>Work Experience</h3>
    <p><strong>${resume.workExperience.role}</strong> at <span contenteditable="true">${resume.workExperience.company}</span> 
    for <span contenteditable="true">${resume.workExperience.duration}</span> years</p>
    <h3>Skills</h3>
    <ul>
      ${resume.skills.map(skill => `<li contenteditable="true">${skill}</li>`).join('')}
    </ul>
  `;

  resumeOutput.innerHTML = resumeHtml;

  // Hide the form after resume is generated
  document.querySelector(".form")?.setAttribute("style", "display: none;");
  resumeOutput.style.display = "block";

  // Generate unique URL with resume data
  const username = usernameInput?.value.trim() || "user";
  const resumeData = encodeURIComponent(JSON.stringify(resume)); // Encode resume data to avoid URL issues
  const resumeUrl = `${window.location.href.split('?')[0]}?username=${username}&data=${resumeData}`;

  // Update the share link with the generated URL
  if (shareLink) {
    shareLink.href = resumeUrl;
    shareLink.textContent = "Click to View Your Resume";
  }

  // Enable copy link button
  if (copyLinkButton) {
    copyLinkButton.style.display = "inline-block";
    copyLinkButton.onclick = () => {
      navigator.clipboard.writeText(resumeUrl).then(() => {
        alert("URL copied to clipboard!");
      });
    };
  }
}

// Handle URL parameters to display only the resume
window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  if (params.has('data')) {
    const resumeData = JSON.parse(decodeURIComponent(params.get('data')!));
    generateResume(resumeData);
  }
};


function downloadResumeAsPDF() {
  const resumeElement = document.getElementById("resume-output");
  if (resumeElement) {
    html2pdf()
      .from(resumeElement)
      .save("resume.pdf");
  }
}
