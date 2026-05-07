import api from "../api";

export async function getLocations() {
  try {
    const response = await api.get("/getbranches");
    if (!response.data.success)
      throw new Error(response.data?.error || `Error getiing branches`);
    return response.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error:
        error.response.data?.error ||
        `Unable to fetch branches. Check connection / contact admin`,
    };
  }
}

export async function getDepartments() {
  try {
    const response = await api.get("/getdepartments");
    if (!response.data.success)
      throw new Error(response.data?.error || `Error getiing departments`);
    return response.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error:
        error.response.data?.error ||
        `Unable to fetch departments. Check connection / contact admin`,
    };
  }
}

export async function getRoles() {
  try {
    const response = await api.get("/getroles");
    if (!response.data.success)
      throw new Error(response.data?.error || `Error getiing departments`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error:
        error.response.data?.error ||
        `Unable to fetch departments. Check connection / contact admin`,
    };
  }
}

export async function getUsers() {
  try {
    const response = await api.get("/getusers");
    if (!response.data.success)
      throw new Error(response.data?.error || `unable to fetch users`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error:
        error.response.data?.error ||
        `error fetching users. Check connection / contact admin`,
    };
  }
}

export async function getDevices() {
  try {
    const response = await api.get("/getdevicetable");
    if (!response.data.success)
      throw new Error(response.data?.error || `unable to fetch devices`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error:
        error.response.data?.error ||
        `Error fetching devices. Check connection / contact admin`,
    };
  }
}
