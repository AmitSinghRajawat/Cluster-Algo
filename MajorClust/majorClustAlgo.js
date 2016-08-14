/***
@author:Amit Rajawat
This code is written for visualization, do not use it for testing cases
*/

var tokens = [];

var tfidf_vector = Create2DArray(get_docs().length);
var doc_mod = [];
var clust_id = [];
var clust_edges = Create2DArray(get_docs().length);
var max = [];

for (var i in docs)
    max[i] = 0;

var flag = true;
var hash = Create2DArray(get_docs().length);

/***
@function:to create two dimensional array of given size
*/
function Create2DArray(rows) {
    var arr = [];

    for (var i = 0; i < rows; i++) {
        arr[i] = [];
    }

    return arr;
}

/***
@function:returns all documents in an array docs[]
*/
function get_docs() {

    docs = [
        [{
            "museum": 64380
        }, {
            "sight_seeing": 37198
        }, {
            "architecture": 33933
        }, {
            "walking": 32707
        }, {
            "culture": 4555
        }], // Amsterdam

        [{
            "food": 4896
        }, {
            "city_walk": 5547
        }, {
            "old_town": 1968
        }, {
            "sight_seeing": 4589
        }, {
            "architecture": 2433
        }, {
            "culture": 4555
        }], //Lisboa

        [{
            "history": 3434
        }, {
            "monuments": 12344
        }, {
            "architecture": 5433
        }, {
            "culture": 22200
        }], //Paris

        [{
            "history": 4312
        }, {
            "food": 6464
        }, {
            "art": 4545
        }, {
            "culture": 5200
        }, {
            "shopping": 2500
        }], //Bangkok

        [{
            "pubs": 5555
        }, {
            "bar": 5559
        }, {
            "restaurant": 9800
        }, {
            "hotels": 1118
        }], // Las Vegas

        [{
            "wildlife": 1200
        }, {
            "sanctuary": 2488
        }, {
            "park": 5477
        }], // Brazil

        [{
            "old_town": 33333
        }, {
            "sight_seeing": 5000
        }, {
            "friendly_people": 1288
        }, {
            "shark_diving": 1
        }], // London

        [{
            "sea": 3288
        }, {
            "beaches": 2228
        }, {
            "party": 4455
        }, {
            "sport": 4588
        }, {
            "shark_diving": 10982
        }], //Pattaya
    ]

    return docs;
}

/***
@function:extracts each word of a document as a token
*/
function get_tokens(documents) {
    tokens = documents;
}

function get_total_weightage(index) {
    weight = 0;
    for (var i in tokens[index]) {
        key = Object.keys(tokens[index][i]);
        counter = tokens[index][i][key];
        weight += counter;
    }
    return weight;
}

/***
@function:calculates the tfidf of every token 
*/
function get_tfidf(documents) {
    for (var doc_id in docs) {
        total_doc_weight = get_total_weightage(doc_id);
        for (var token_id in tokens[doc_id]) {
            //counter = 0;
            key = Object.keys(tokens[doc_id][token_id]);
            counter = tokens[doc_id][token_id][key];

            tf = counter / total_doc_weight;

            tfidf = tf;
            tfidf_vector[doc_id][token_id] = tfidf;
        }
    }
}

/***
@function:gets the dot product of respective tfidf(s) between document[a] and document[b]
*/
function cosine_length(a, b) {
    cos = 0.0;
    for (var i in tokens[a]) {
        for (var j in tokens[b]) {
            if (Object.keys(tokens[a][i]).toString() == Object.keys(tokens[b][j]).toString())
                cos = cos + tfidf_vector[a][i] * tfidf_vector[b][j];
            else
                continue;
        }
    }

    cosine = normalize(cos, a, b);
    return cosine;
}

/***
@function:normalize the dot product obtained by cosine length() function
*/
function normalize(cos_value, a, b) {
    for (var i in docs) {
        doc_mod[i] = 0;
        for (var j in tokens[i]) {
            doc_mod[i] = doc_mod[i] + tfidf_vector[i][j] * tfidf_vector[i][j];
        }
        doc_mod[i] = Math.sqrt(doc_mod[i]);
    }

    normalized_vector = cos_value / (doc_mod[a] * doc_mod[b]);
    return normalized_vector;
}

/***
@function:assign cluster id to the node of the maximum cumulative cosine length of the existing cluster
*/

var count = 1;

function get_cluster(a) {

    flag = false;
    sum = 0;

    for (var k in clust_edges[a % get_docs().length]) {
        id = get_clust_id(clust_edges[a % get_docs().length][k]);

        for (var j in clust_edges[a % get_docs().length]) {
            if (id != get_clust_id(clust_edges[a % get_docs().length][j]))
                continue;
            else {
                sum = sum + cosine_length(a % get_docs().length, clust_edges[a % get_docs().length][j]);
            }
        }

        if (sum > max[a % get_docs().length]) {
            max[a % get_docs().length] = sum;
            if (clust_id[a % get_docs().length] != id) {
                clust_id[a % get_docs().length] = id;
                flag = true;
            }
        }
        sum = 0;
    }
    return (clust_id);
}



/***
@function:initially each node is assigned to it's own cluster
*/
function id_initialization() {
    for (var i in docs)
        clust_id[i] = i;

}

/***
@function:concatenates same cluster nodes to a one array index
*/
function hashing_cluster() {
    for (var i in clust_id) {
        hash[clust_id[i]].push(docs[i]);
    }

}

/***
@function:returns the cluster id of the node
*/
function get_clust_id(node) {

    return clust_id[node];
}

/***
@function:maps each node to it's non-zero edges
*/
function get_edges() {
    for (var i in docs) {
        for (var j in docs) {
            if (i != j) {
                if (cosine_length(i, j)) {
                    clust_edges[i].push(j);

                }
            } else
                continue;
        }
    }

}
/***
@function:displays the final cluster separated by '==' delimiter
*/
function show_cluster() {

    for (var i in docs) {
        delimiter = false;
        for (var j in hash[i]) {
            console.log(hash[i][j] + '\n');
            delimiter = true;
        }
        if (delimiter)
            console.log('==========================================');
    }
}
/***
@function:this function calls all the function in order
*/
function main() {
    var documents = get_docs();
    get_tokens(documents);
    get_tfidf();
    get_edges();
    id_initialization();
}

main();

function cluster(a) {
    return (get_cluster(a));
}
