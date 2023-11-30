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

//fetch admin reservations
export const fetchAdminReservations = async ({
    admin_id,
    range_start_date,
    range_end_date,
    date,
  }) => {
    try {
      const requestBody = {};
  
      if (admin_id) {
        requestBody.admin_id = admin_id;
      }
      if (range_start_date) {
        requestBody.range_start_date = range_start_date;
      }
      if (range_end_date) {
        requestBody.range_end_date = range_end_date;
      }
      if(date){
        requestBody.date = date;
      }
  
      const data = await fetch("http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/reservation/filter", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });
  
      if (!data.ok) {
        throw new Error("Failed to fetch admin reservations");
      }
      const admin_reservations = await data.json();
      return {
        success: true,
        data: admin_reservations,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "Failed to fetch admin reservations",
      };
    }
  };