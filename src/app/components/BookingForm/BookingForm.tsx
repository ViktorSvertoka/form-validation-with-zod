"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createBookingSchema,
  BookingFormData,
} from "@/app/schemas/bookingSchema";
import ErrorMessage from "@/app/components/ErrorMessage/ErrorMessage";
import styles from "./BookingForm.module.css";

export default function BookingForm() {
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const schema = createBookingSchema(timeSlots);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchTimeSlots = async () => {
      const res = await fetch("/api/time-slots");
      const data = await res.json();
      setTimeSlots(data);
    };
    fetchTimeSlots();
  }, []);

  const onSubmit = (data: BookingFormData) => {
    console.log("Form Data:", data);
    alert("Booking successful!");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.inputGroup}>
        <label htmlFor="bookerName" className={styles.label}>
          Booker Name
        </label>
        <input
          id="bookerName"
          className={styles.input}
          {...register("bookerName")}
        />
        <ErrorMessage message={errors.bookerName?.message} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="bookerEmail" className={styles.label}>
          Booker Email
        </label>
        <input
          id="bookerEmail"
          type="email"
          className={styles.input}
          {...register("bookerEmail")}
        />
        <ErrorMessage message={errors.bookerEmail?.message} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="eventName" className={styles.label}>
          Event Name
        </label>
        <input
          id="eventName"
          className={styles.input}
          {...register("eventName")}
        />
        <ErrorMessage message={errors.eventName?.message} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="eventDate" className={styles.label}>
          Event Date
        </label>
        <input
          id="eventDate"
          type="date"
          className={styles.input}
          {...register("eventDate")}
        />
        <ErrorMessage message={errors.eventDate?.message} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="numberOfGuests" className={styles.label}>
          Number of Guests
        </label>
        <input
          id="numberOfGuests"
          type="number"
          className={styles.input}
          {...register("numberOfGuests", { valueAsNumber: true })}
        />
        <ErrorMessage message={errors.numberOfGuests?.message} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="timeSlot" className={styles.label}>
          Time Slot
        </label>
        <select
          id="timeSlot"
          className={styles.input}
          {...register("timeSlot")}
        >
          <option value="">Select a time slot</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        <ErrorMessage message={errors.timeSlot?.message} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="eventLink" className={styles.label}>
          Event Link (Online)
        </label>
        <input
          id="eventLink"
          type="url"
          className={styles.input}
          {...register("eventLink")}
        />
        <ErrorMessage message={errors.eventLink?.message} />
      </div>

      <button type="submit" className={styles.button}>
        Book Event
      </button>
    </form>
  );
}
