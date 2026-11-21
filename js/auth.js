
async function getCurrentUser() {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error) throw error;
  return data.user;
}

async function getMyProfile() {
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabaseClient
    .from("user_profiles")
    .select("id, user_id, full_name, role, student_id, teacher_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

function dashboardForRole(role) {
  const paths = {
    admin: "admin/dashboard.html",
    teacher: "teacher/dashboard.html",
    student: "student/dashboard.html"
  };

  return paths[role] || "login.html";
}

async function requireLogin() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      window.location.href = "/Bulchana-Student-Management-System/login.html";
      return null;
    }

    const profile = await getMyProfile();

    if (!profile) {
      alert("Your account has no approved system profile. Contact the administrator.");
      await supabaseClient.auth.signOut();
      window.location.href = "/Bulchana-Student-Management-System/login.html";
      return null;
    }

    return profile;
  } catch (error) {
    console.error(error);
    alert("Unable to verify your account. Please log in again.");
    window.location.href = "/Bulchana-Student-Management-System/login.html";
    return null;
  }
}

async function logout() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert(error.message);
    return;
  }

  window.location.href = "/Bulchana-Student-Management-System/login.html";
}
