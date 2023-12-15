//create new reservation
export const addNewReservation = async (reservation_data) => {
  try {
    const request_data = {
      company_id: reservation_data.company_id,
      admin_id: reservation_data.admin_id,
      reservation_admin_id: reservation_data.reservation_admin_id,
      service_id: reservation_data.service_id,
      name: reservation_data.name,
      description: reservation_data.description,
      start_time: reservation_data.start_time,
      end_time: reservation_data.end_time,
      date: reservation_data.date,
    };

    const data = await fetch(
      "http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/reservation",
      {
        method: "PUT",
        body: JSON.stringify(request_data),
      }
    );

    if (!data.ok) {
      throw new Error("Failed to add new reservations!");
    }

    const new_rent = await data.json();

    // if result is false
    if (new_rent.result === false) {
      return {
        success: false,
        error: "Failed to add new reservations!",
      };
    }

    return {
      success: true,
      data: new_rent,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to add new reservations!",
    };
  }
};

//delete reservation
export const deleteReservation = async (rent_id) => {
  try {
    const request_data = {
      id: rent_id,
    };

    const data = await fetch(
      "http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/reservation",
      {
        method: "DELETE",
        body: JSON.stringify(request_data),
      }
    );
    if (!data.ok) {
      throw new Error("Failed to delete reservations!");
    }

    const new_rent = await data.json();

    // if result is false
    if (new_rent.result === false) {
      return {
        success: false,
        error: "Failed to delete reservations!",
      };
    }

    //return success
    return {
      success: true,
    };

  } catch (error) {
    return {
      success: false,
      error: "Failed to delete reservations!",
    };
  }
};

//update reservation
export const updateReservation = async (params) =>{

}
