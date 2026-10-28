package jar;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrainRepository extends JpaRepository<Train, String> {

    List<Train> findBySourceIgnoreCaseAndDestinationIgnoreCase(
            String source, String destination);
}