package jar;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/trains")
public class TrainController {

    private final TrainRepository trainRepository;

    public TrainController(TrainRepository trainRepository) {
        this.trainRepository = trainRepository;
    }

    @GetMapping
    public List<Train> getAllTrains() {
        return trainRepository.findAll();
    }

    @GetMapping("/search")
    public List<Train> searchTrains(
            @RequestParam String source,
            @RequestParam String destination) {

        return trainRepository
                .findBySourceIgnoreCaseAndDestinationIgnoreCase(
                        source, destination);
    }

    @PostMapping
    public Train addTrain(@RequestBody Train train) {
        return trainRepository.save(train);
    }
}