
package jar;

import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingRepository bookingRepository;

    public BookingController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // Create a new booking
    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {

        String pnr = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 10)
                .toUpperCase();

        booking.setPnr(pnr);

        return bookingRepository.save(booking);
    }

    // Get all bookings
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get booking by PNR
    @GetMapping("/{pnr}")
    public Booking getBooking(@PathVariable String pnr) {
        return bookingRepository.findByPnr(pnr)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));
    }
}
