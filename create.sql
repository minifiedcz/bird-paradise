CREATE TABLE Images (
    image_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    file_name TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    caption TEXT NOT NULL
);

CREATE TABLE Families (
    family_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_ID INTEGER NOT NULL,
    FOREIGN KEY (image_ID) REFERENCES Images(image_ID) 
);

CREATE TABLE Birds (
    bird_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    scientific_name TEXT NOT NULL,
    family_ID INTEGER NOT NULL,
    size INTEGER NOT NULL,
    description TEXT NOT NULL,
    image_ID INTEGER NOT NULL,
    FOREIGN KEY (family_ID) REFERENCES Families(family_ID),
    FOREIGN KEY (image_ID) REFERENCES Images(image_ID) 
);

INSERT INTO Images (file_name, alt_text, caption) VALUES
('black_swan.jpg', 'A black swan floating on water, showing its elegant black feathers and red beak.', 'A black swan.'),
('mallard.jpg', 'A male mallard duck with a vibrant green head swimming on water.', 'A mallard.'),
('galahs.jpg', 'A brilliant pink galahs perched among bright pink flowers.', 'Galahs.'),
('pink_cockatoo.jpg', 'A pink cockatoo perched on a branch with a pale background.', 'A pink cockatoo.'),
('crested_pigeon.jpg', 'A crested pigeon standing on a tree stump, showing its unique crest and striped feathers.', 'A crested pigeon.'),
('rock_dove.jpg', 'A rock dove perched on a railing with a background of water.', 'A rock dove.'),
('australian_white_ibis.jpg', 'A group of Australian white ibises standing in shallow water.', 'An Australian white ibis.'),
('masked_lapwing.jpg', 'A masked lapwing walking along sandy ground near water.', 'A masked lapwing.'),
('noisy_minor.jpg', 'A noisy minor perched on a branch, showcasing its gray feathers and yellow eye markings.', 'A noisy minor.'),
('yellow_throated_minor.jpg', 'A yellow-throated minor perched on a dry tree branch against a blue sky.', 'A yellow-throated minor.'),
('flame_robin.jpg', 'A flame robin perched on a log, displaying its bright orange chest and dark gray feathers.', 'A flame robin.'),
('eastern_yellow_robin.jpg', 'An eastern yellow robin perched on a branch in a burnt forest setting.', 'An eastern yellow robin.');

INSERT INTO Families (name, description, image_ID) VALUES
('Ducks', 'Birds belonging to the duck family, typically aquatic with webbed feet. Ducks are found worldwide and often inhabit freshwater lakes, ponds, and rivers. Some species, such as mallards, are highly adaptable and have been introduced to areas outside their native range. Ducks are social, often found in groups, and play important ecological roles in wetland habitats.', 1),
('Parrots', 'Parrots are intelligent and sociable birds often found in forests and woodlands. Native to regions around the world, many species, such as galahs and pink cockatoos, are iconic in Australia. These birds are known for their strong pair bonds and vibrant calls. Some species have adapted well to urban environments.', 3),
('Pigeons', 'Pigeons are common birds found in both natural and urban settings. Species like the rock dove are not native but have established populations globally, while others, like the crested pigeon, are native to Australia. They are known for their unique ability to find their way home over long distances.', 5),
('Water Birds', 'Water birds encompass species that rely heavily on aquatic environments, such as wetlands, rivers, and coastal areas. The Australian white ibis, also called the "bin chicken" locally, and the masked lapwing are prominent examples in Australia. These birds often display opportunistic feeding behaviors.', 7),
('Honey Eaters', 'Honeyeaters are nectar-feeding birds native to Australasia. They play a crucial role in pollination. Species like the noisy miner and yellow-throated miner are commonly found in open woodlands and urban parks, often displaying highly social and territorial behaviors.', 9),
('Robins', 'Robins are small, colorful passerines often associated with gardens and open forests. The flame robin and eastern yellow robin are native to Australia and are known for their vibrant plumage and distinct vocalizations. These birds are often solitary or found in small family groups.', 11);

INSERT INTO Birds (name, scientific_name, family_ID, size, description, image_ID) VALUES
('Black Swan', 'Cygnus atratus', 1, 140, 'The black swan is native to Australia and commonly found in wetlands, rivers, and lakes. Known locally as "Kulaluk" in some Indigenous languages, it is a symbol of elegance and resilience. Black swans are monogamous, forming lifelong pairs, and are often seen gracefully gliding across water bodies.', 1),
('Mallard', 'Anas platyrhynchos', 1, 70, 'Mallards are one of the most widely recognized duck species, native to the Northern Hemisphere but introduced to other parts of the world, including Australia. They thrive in urban parks and natural wetlands, where they are social and adaptable.', 2),
('Galahs', 'Eolophus roseicapillus', 2, 38, 'Galahs are native Australian parrots also known as "pink and gray cockatoos." They are commonly found in open country, farmlands, and urban areas, where they live in large flocks. These birds are playful and highly vocal, often seen feeding on seeds and grains.', 3),
('Pink Cockatoo', 'Lophochroa leadbeateri', 2, 40, 'The pink cockatoo, also called Major Mitchell’s cockatoo, is native to arid and semi-arid regions of Australia. It is named after Major Sir Thomas Mitchell, an explorer who first described the bird. These cockatoos are less social than others, often seen in pairs or small groups.', 4),
('Crested Pigeon', 'Ocyphaps lophotes', 3, 35, 'The crested pigeon is native to Australia and can often be found in grasslands, woodlands, and urban areas. Known for its whistling flight sound, it feeds primarily on seeds and is commonly seen foraging on the ground.', 5),
('Rock Dove', 'Columba livia', 3, 35, 'The rock dove, also known as the common pigeon, is not native to Australia but has established populations worldwide. It is highly adaptable and thrives in cities and rural areas. Historically, these pigeons have been used for communication due to their homing abilities.', 6),
('Australian White Ibis', 'Threskiornis molucca', 4, 80, 'The Australian white ibis, often nicknamed "bin chicken," is a native water bird known for its adaptability to urban environments. While traditionally found in wetlands, it has become a common sight in cities, scavenging for food.', 7),
('Masked Lapwing', 'Vanellus miles', 4, 40, 'The masked lapwing is a ground-dwelling bird native to Australia and nearby regions. It is known for its loud calls and aggressive behavior, especially during nesting season when defending its territory.', 8),
('Noisy Minor', 'Manorina melanocephala', 5, 28, 'The noisy miner is a native Australian honeyeater known for its bold and territorial behavior. Found in open woodlands and suburban parks, this bird is highly social and often seen in groups chasing away larger birds.', 9),
('Yellow-Throated Minor', 'Manorina flavigula', 5, 28, 'The yellow-throated miner is native to Australia and commonly found in arid and semi-arid regions. It is a social bird, often seen in flocks, and plays a role in controlling insect populations.', 10),
('Flame Robin', 'Petroica phoenicea', 6, 13, 'The flame robin is a small songbird native to southeastern Australia. It is often found in open forests and woodlands, where it forages on the ground for insects. During the breeding season, males display bright orange plumage.', 11),
('Eastern Yellow Robin', 'Eopsaltria australis', 6, 20, 'The eastern yellow robin is native to eastern Australia and inhabits forests and woodlands. Known for its quiet and curious behavior, this robin often perches on low branches, making short flights to catch insects.', 12);

SELECT * FROM Images;
SELECT * FROM Families;
SELECT * FROM Birds;